"""
Real-time Attention Prediction
Use trained model to predict attention level from live data
"""

import joblib
import numpy as np
import pymongo
from datetime import datetime

# Load trained model
import os
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'attention_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'scaler.pkl')

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("Model loaded successfully")
except FileNotFoundError:
    print("Model not found. Please train the model first using train_attention_model.py")
    exit(1)

def extract_features_from_window(gaze_samples, game_events):
    """
    Extract features from a time window of gaze samples and game events
    Same feature extraction logic as training
    """
    import pandas as pd
    
    if len(gaze_samples) < 10:
        return None
    
    gaze_df = pd.DataFrame(gaze_samples)
    events_df = pd.DataFrame([{**e.get('payload', {}), 'ts': e.get('ts'), 'type': e.get('type')} 
                             for e in game_events])
    
    feature_vector = []
    
    # Gaze statistics
    if 'gazeX' in gaze_df.columns and gaze_df['gazeX'].notna().sum() > 0:
        feature_vector.extend([
            gaze_df['gazeX'].mean(),
            gaze_df['gazeX'].std() if gaze_df['gazeX'].std() > 0 else 0,
            gaze_df['gazeX'].var() if gaze_df['gazeX'].var() > 0 else 0,
        ])
    else:
        feature_vector.extend([0, 0, 0])
    
    if 'gazeY' in gaze_df.columns and gaze_df['gazeY'].notna().sum() > 0:
        feature_vector.extend([
            gaze_df['gazeY'].mean(),
            gaze_df['gazeY'].std() if gaze_df['gazeY'].std() > 0 else 0,
            gaze_df['gazeY'].var() if gaze_df['gazeY'].var() > 0 else 0,
        ])
    else:
        feature_vector.extend([0, 0, 0])
    
    # Face presence
    if 'facePresent' in gaze_df.columns:
        face_presence_ratio = gaze_df['facePresent'].sum() / len(gaze_df)
        feature_vector.append(face_presence_ratio)
    else:
        feature_vector.append(0)
    
    # Gaze velocity
    if len(gaze_df) > 1 and 'gazeX' in gaze_df.columns:
        gaze_changes = np.diff(gaze_df[['gazeX', 'gazeY']].fillna(0).values, axis=0)
        gaze_velocity = np.mean(np.linalg.norm(gaze_changes, axis=1))
        feature_vector.append(gaze_velocity)
    else:
        feature_vector.append(0)
    
    # Game performance
    ball_collected = len(events_df[events_df['type'] == 'BALL_COLLECTED'])
    red_hits = len(events_df[events_df['type'] == 'RED_HIT'])
    score_changes = events_df[events_df['type'] == 'SCORE_CHANGED']
    
    feature_vector.extend([
        ball_collected,
        red_hits,
        score_changes['score'].max() if len(score_changes) > 0 and 'score' in score_changes.columns else 0,
    ])
    
    # Reaction time
    reaction_events = events_df[events_df['type'] == 'REACTION']
    if len(reaction_events) > 0 and 'reactionMs' in reaction_events.columns:
        feature_vector.extend([
            reaction_events['reactionMs'].mean(),
            reaction_events['reactionMs'].std() if reaction_events['reactionMs'].std() > 0 else 0,
        ])
    else:
        feature_vector.extend([0, 0])
    
    # Time elapsed (placeholder - should be calculated from session start)
    feature_vector.append(0)
    
    return np.array(feature_vector)

def predict_attention_level(gaze_samples, game_events):
    """
    Predict attention level from gaze samples and game events
    
    Returns:
        prediction: 0 (low attention) or 1 (high attention)
        probability: [prob_low, prob_high]
    """
    features = extract_features_from_window(gaze_samples, game_events)
    
    if features is None:
        return None, None
    
    features_scaled = scaler.transform([features])
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0]
    
    return int(prediction), probability

def analyze_session(session_id, mongo_uri, db_name="fish_attention"):
    """Analyze a complete session and return attention metrics"""
    client = pymongo.MongoClient(mongo_uri)
    db = client[db_name]
    
    from bson import ObjectId
    
    gaze_samples = list(db.gazesamples.find({"sessionId": ObjectId(session_id)}).sort("ts", 1))
    game_events = list(db.gameevents.find({"sessionId": ObjectId(session_id)}).sort("ts", 1))
    
    client.close()
    
    if len(gaze_samples) == 0:
        return None
    
    # Analyze in windows
    window_size_ms = 5000
    start_time = min(g['ts'] for g in gaze_samples)
    end_time = max(g['ts'] for g in gaze_samples)
    
    attention_scores = []
    current_time = start_time
    
    while current_time < end_time:
        window_end = current_time + window_size_ms
        
        window_gaze = [g for g in gaze_samples if current_time <= g['ts'] < window_end]
        window_events = [e for e in game_events if current_time <= e['ts'] < window_end]
        
        if len(window_gaze) >= 10:
            pred, prob = predict_attention_level(window_gaze, window_events)
            if pred is not None:
                attention_scores.append({
                    'time': current_time,
                    'attention_level': pred,
                    'confidence': float(max(prob))
                })
        
        current_time += window_size_ms // 2
    
    if len(attention_scores) == 0:
        return None
    
    avg_attention = np.mean([s['attention_level'] for s in attention_scores])
    high_attention_ratio = sum(1 for s in attention_scores if s['attention_level'] == 1) / len(attention_scores)
    
    return {
        'session_id': session_id,
        'total_windows': len(attention_scores),
        'average_attention': float(avg_attention),
        'high_attention_ratio': float(high_attention_ratio),
        'attention_timeline': attention_scores
    }

if __name__ == "__main__":
    # Example usage
    print("Attention Prediction System")
    print("="*50)
    
    # Example: predict from sample data
    sample_gaze = [
        {'ts': 1000, 'facePresent': True, 'gazeX': 0.1, 'gazeY': 0.2},
        {'ts': 1100, 'facePresent': True, 'gazeX': 0.15, 'gazeY': 0.25},
        # ... more samples
    ]
    
    sample_events = [
        {'type': 'BALL_COLLECTED', 'ts': 1200, 'payload': {'ballColor': 'blue'}},
        # ... more events
    ]
    
    pred, prob = predict_attention_level(sample_gaze, sample_events)
    if pred is not None:
        print(f"Prediction: {'High Attention' if pred == 1 else 'Low Attention'}")
        print(f"Confidence: {prob[1]:.2%}")

