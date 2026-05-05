"""
Machine Learning Model for Attention Analysis
Fish Ball Collector Game - Attention Study

This script trains a model to analyze attention patterns based on:
- Eye tracking data (gaze direction, facial landmarks)
- Game performance data (score, reaction time, ball collection patterns)
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import pymongo
from datetime import datetime
import warnings
import os
import json
warnings.filterwarnings('ignore')

# MongoDB connection
MONGO_URI = "mongodb+srv://gameadmin:0SUWKobwyF69Vbim@cluster0.yzm6vxn.mongodb.net/fish_attention?appName=Cluster0"
DB_NAME = "fish_attention"  

def fetch_data_from_mongodb():
    """Fetch gaze samples and game events from MongoDB"""
    print("Connecting to MongoDB...")
    # Add timeout and connection settings
    client = pymongo.MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=30000,  # 30 seconds
        socketTimeoutMS=60000,  # 60 seconds for operations
        connectTimeoutMS=30000,  # 30 seconds to connect
        maxPoolSize=10
    )
    db = client[DB_NAME]
    
    # Fetch all sessions
    sessions = list(db.sessions.find({}))
    print(f"Found {len(sessions)} sessions")
    
    all_features = []
    all_labels = []
    
    for idx, session in enumerate(sessions, 1):
        session_id = session['_id']
        print(f"  [{idx}/{len(sessions)}] Processing session {session_id}...", end=" ", flush=True)
        
        try:
            # Fetch gaze samples in batches to avoid timeout
            # Limit to 10000 samples per session to prevent timeout (can be adjusted)
            max_gaze_samples = 10000
            gaze_samples = []
            cursor = db.gazesamples.find({"sessionId": session_id}).sort("ts", 1).limit(max_gaze_samples).batch_size(1000)
            for sample in cursor:
                gaze_samples.append(sample)
            
            # Fetch game events (usually much smaller, no limit needed)
            game_events = []
            cursor = db.gameevents.find({"sessionId": session_id}).sort("ts", 1).batch_size(1000)
            for event in cursor:
                game_events.append(event)
            
            print(f"({len(gaze_samples)} gaze, {len(game_events)} events)", end=" ", flush=True)
            
            if len(gaze_samples) == 0 or len(game_events) == 0:
                print("SKIPPED")
                continue
            
            # Extract features from this session
            features, labels = extract_features(gaze_samples, game_events)
            if len(features) > 0:
                all_features.extend(features)
                all_labels.extend(labels)
                print(f"DONE {len(features)} features")
            else:
                print(" ")
        except Exception as e:
            print(f"ERROR: {str(e)}")
            continue
    
    client.close()
    return np.array(all_features), np.array(all_labels)

def extract_features(gaze_samples, game_events):
    """
    Extract features from gaze samples and game events
    
    Features:
    - Gaze statistics (mean, std, variance of gazeX, gazeY)
    - Face presence ratio
    - Reaction time statistics
    - Score progression
    - Ball collection patterns
    - Time-based features
    """
    features = []
    labels = []
    
    # Convert to DataFrames for easier processing
    gaze_df = pd.DataFrame(gaze_samples)
    events_df = pd.DataFrame([{**e['payload'], 'ts': e['ts'], 'type': e['type']} for e in game_events])
    
    if len(gaze_df) == 0 or len(events_df) == 0:
        return features, labels
    
    # Time window for feature extraction (e.g., 5 seconds)
    window_size_ms = 5000
    start_time = gaze_df['ts'].min()
    end_time = gaze_df['ts'].max()
    
    current_time = start_time
    
    while current_time < end_time:
        window_end = current_time + window_size_ms
        
        # Get gaze samples in this window
        window_gaze = gaze_df[(gaze_df['ts'] >= current_time) & (gaze_df['ts'] < window_end)]
        
        # Get game events in this window
        window_events = events_df[(events_df['ts'] >= current_time) & (events_df['ts'] < window_end)]
        
        if len(window_gaze) < 10:  # Need minimum samples
            current_time += window_size_ms // 2  # 50% overlap
            continue
        
        # Feature extraction
        feature_vector = []
        
        # 1. Gaze statistics
        if 'gazeX' in window_gaze.columns and window_gaze['gazeX'].notna().sum() > 0:
            feature_vector.extend([
                window_gaze['gazeX'].mean(),
                window_gaze['gazeX'].std() if window_gaze['gazeX'].std() > 0 else 0,
                window_gaze['gazeX'].var() if window_gaze['gazeX'].var() > 0 else 0,
            ])
        else:
            feature_vector.extend([0, 0, 0])
        
        if 'gazeY' in window_gaze.columns and window_gaze['gazeY'].notna().sum() > 0:
            feature_vector.extend([
                window_gaze['gazeY'].mean(),
                window_gaze['gazeY'].std() if window_gaze['gazeY'].std() > 0 else 0,
                window_gaze['gazeY'].var() if window_gaze['gazeY'].var() > 0 else 0,
            ])
        else:
            feature_vector.extend([0, 0, 0])
        
        # 2. Face presence ratio
        if 'facePresent' in window_gaze.columns:
            face_presence_ratio = window_gaze['facePresent'].sum() / len(window_gaze)
            feature_vector.append(face_presence_ratio)
        else:
            feature_vector.append(0)
        
        # 3. Gaze movement (velocity)
        if len(window_gaze) > 1 and 'gazeX' in window_gaze.columns:
            gaze_changes = np.diff(window_gaze[['gazeX', 'gazeY']].fillna(0).values, axis=0)
            gaze_velocity = np.mean(np.linalg.norm(gaze_changes, axis=1))
            feature_vector.append(gaze_velocity)
        else:
            feature_vector.append(0)
        
        # 4. Game performance features
        ball_collected = len(window_events[window_events['type'] == 'BALL_COLLECTED'])
        red_hits = len(window_events[window_events['type'] == 'RED_HIT'])
        score_changes = window_events[window_events['type'] == 'SCORE_CHANGED']
        
        feature_vector.extend([
            ball_collected,
            red_hits,
            score_changes['score'].max() if len(score_changes) > 0 and 'score' in score_changes.columns else 0,
        ])
        
        # 5. Reaction time statistics
        reaction_events = window_events[window_events['type'] == 'REACTION']
        if len(reaction_events) > 0 and 'reactionMs' in reaction_events.columns:
            feature_vector.extend([
                reaction_events['reactionMs'].mean(),
                reaction_events['reactionMs'].std() if reaction_events['reactionMs'].std() > 0 else 0,
            ])
        else:
            feature_vector.extend([0, 0])
        
        # 6. Time-based features
        time_elapsed = (window_end - start_time) / 1000  # seconds
        feature_vector.append(time_elapsed)
        
        # ADHD Prediction Logic (Translated from frontend to define labeling)
        # We classify as 0 (Low Attention/ADHD) if score >= 2, else 1 (High Attention)
        adhd_score = 0
        is_face_valid = face_presence_ratio > 0

        # Inattention: looking away from screen
        if face_presence_ratio < 0.8:
            adhd_score += 2
            
        # Hyperactivity: fast eye movements
        if gaze_velocity > 0.050:
            adhd_score += 2
            
        # Inattention/Hyperactivity: high scatter of gaze
        var_x = window_gaze['gazeX'].var() if 'gazeX' in window_gaze.columns else 0
        var_y = window_gaze['gazeY'].var() if 'gazeY' in window_gaze.columns else 0
        if var_x > 0.020 or var_y > 0.020:
            adhd_score += 1
            
        # Inattention/Impulsivity: high reaction time variability
        std_reaction = reaction_events['reactionMs'].std() if (len(reaction_events) > 0 and 'reactionMs' in reaction_events.columns) else 0
        if std_reaction > 500:
            adhd_score += 1

        # Binary classification: 1 = high attention (Normal), 0 = potential attention issues (ADHD profile)
        label = 0 if (is_face_valid and adhd_score >= 2) else 1
        
        features.append(feature_vector)
        labels.append(label)
        
        current_time += window_size_ms // 2  # 50% overlap
    
    return features, labels

def train_model(X, y):
    """Train multiple models and select the best one"""
    print(f"\nTraining on {len(X)} samples with {X.shape[1]} features")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Store original splits for export
    original_X_train, original_X_test = X_train.copy(), X_test.copy()
    original_y_train, original_y_test = y_train.copy(), y_test.copy()
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train multiple models
    models = {
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42, max_depth=5),
        'Neural Network': MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=500, random_state=42)
    }
    
    best_model = None
    best_score = 0
    best_name = None
    
    results = {}
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train_scaled, y_train)
        
        y_pred = model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        results[name] = {
            'model': model,
            'accuracy': accuracy,
            'report': classification_report(y_test, y_pred),
            'confusion_matrix': confusion_matrix(y_test, y_pred)
        }
        
        print(f"{name} Accuracy: {accuracy:.4f}")
        print(classification_report(y_test, y_pred))
        
        if accuracy > best_score:
            best_score = accuracy
            best_model = model
            best_name = name
    
    print(f"\n{'='*50}")
    print(f"Best Model: {best_name} with accuracy {best_score:.4f}")
    print(f"{'='*50}")
    
    # Save best model and scaler
    script_dir = os.path.dirname(__file__) if '__file__' in globals() else os.getcwd()
    model_path = os.path.join(script_dir, 'attention_model.pkl')
    scaler_path = os.path.join(script_dir, 'scaler.pkl')
    joblib.dump(best_model, model_path)
    joblib.dump(scaler, scaler_path)
    
    # Export model information to CSV and create report
    export_model_info(best_model, best_name, best_score, results, original_X_train, original_y_train, original_X_test, original_y_test, scaler, X_test_scaled, y_test, script_dir)
    
    return best_model, scaler, results

def export_model_info(model, model_name, accuracy, results, X_train, y_train, X_test, y_test, scaler, X_test_scaled, y_test_actual, output_dir):
    """Export model information to CSV and create a readable report"""
    
    # 1. Export model metrics to CSV
    # Use the already scaled test data and actual predictions from training
    y_test_pred = model.predict(X_test_scaled)
    cm = confusion_matrix(y_test_actual, y_test_pred)
    
    # Handle confusion matrix dimensions
    if cm.shape == (2, 2):
        tn, fp, fn, tp = cm[0][0], cm[0][1], cm[1][0], cm[1][1]
    else:
        tn, fp, fn, tp = 0, 0, 0, 0
    
    metrics_data = {
        'Model': [model_name],
        'Accuracy': [accuracy],
        'Training Samples': [len(X_train)],
        'Test Samples': [len(X_test)],
        'Features': [X_train.shape[1]],
        'Training Date': [datetime.now().strftime('%Y-%m-%d %H:%M:%S')],
        'True Negatives': [tn],
        'False Positives': [fp],
        'False Negatives': [fn],
        'True Positives': [tp]
    }
    
    metrics_df = pd.DataFrame(metrics_data)
    metrics_path = os.path.join(output_dir, 'model_metrics.csv')
    metrics_df.to_csv(metrics_path, index=False)
    print(f"\n✅ Model metrics saved to: {metrics_path}")
    
    # 2. Export feature importance (if available)
    if hasattr(model, 'feature_importances_'):
        feature_names = [f'Feature_{i+1}' for i in range(len(model.feature_importances_))]
        importance_df = pd.DataFrame({
            'Feature': feature_names,
            'Importance': model.feature_importances_
        }).sort_values('Importance', ascending=False)
        
        importance_path = os.path.join(output_dir, 'feature_importance.csv')
        importance_df.to_csv(importance_path, index=False)
        print(f"✅ Feature importance saved to: {importance_path}")
    
    # 3. Export all model results comparison
    comparison_data = []
    for name, result in results.items():
        comparison_data.append({
            'Model': name,
            'Accuracy': result['accuracy'],
            'Confusion_Matrix': str(result['confusion_matrix']),
            'Classification_Report': result['report'].replace('\n', ' | ')
        })
    
    comparison_df = pd.DataFrame(comparison_data)
    comparison_path = os.path.join(output_dir, 'model_comparison.csv')
    comparison_df.to_csv(comparison_path, index=False)
    print(f"✅ Model comparison saved to: {comparison_path}")
    
    # 4. Create a text report
    report_path = os.path.join(output_dir, 'model_report.txt')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("="*60 + "\n")
        f.write("ATTENTION ANALYSIS MODEL - TRAINING REPORT\n")
        f.write("="*60 + "\n\n")
        f.write(f"Training Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write(f"Best Model: {model_name}\n")
        f.write(f"Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)\n\n")
        f.write(f"Training Samples: {len(X_train)}\n")
        f.write(f"Test Samples: {len(X_test)}\n")
        f.write(f"Number of Features: {X_train.shape[1]}\n\n")
        f.write("-"*60 + "\n")
        f.write("CONFUSION MATRIX:\n")
        f.write("-"*60 + "\n")
        f.write(f"{cm}\n\n")
        f.write("-"*60 + "\n")
        f.write("CLASSIFICATION REPORT:\n")
        f.write("-"*60 + "\n")
        f.write(classification_report(y_test_actual, y_test_pred))
        f.write("\n" + "="*60 + "\n")
        f.write("ALL MODELS COMPARISON:\n")
        f.write("="*60 + "\n")
        for name, result in results.items():
            f.write(f"\n{name}:\n")
            f.write(f"  Accuracy: {result['accuracy']:.4f}\n")
            f.write(f"  Confusion Matrix:\n{result['confusion_matrix']}\n")
    
    print(f"✅ Model report saved to: {report_path}")
    
    # 5. Export test predictions
    predictions_df = pd.DataFrame({
        'Actual': y_test_actual,
        'Predicted': y_test_pred,
        'Correct': (y_test_actual == y_test_pred)
    })
    predictions_path = os.path.join(output_dir, 'test_predictions.csv')
    predictions_df.to_csv(predictions_path, index=False)
    print(f"✅ Test predictions saved to: {predictions_path}")

def predict_attention(model, scaler, features):
    """Predict attention level for new features"""
    features_scaled = scaler.transform([features])
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0]
    return prediction, probability

if __name__ == "__main__":
    print("="*50)
    print("Fish Ball Collector - Attention Analysis Model")
    print("="*50)
    
    # Fetch data
    X, y = fetch_data_from_mongodb()
    
    if len(X) == 0:
        print("No data found. Please ensure you have collected game sessions.")
        exit(1)
    
    print(f"\nData loaded: {len(X)} samples, {X.shape[1]} features")
    print(f"Class distribution: {np.bincount(y)}")
    
    # Train model
    model, scaler, results = train_model(X, y)
    
    print("\nModel training completed!")
    print("Saved models:")
    print("  - ml_model/attention_model.pkl")
    print("  - ml_model/scaler.pkl")

