from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os
import joblib

# Import your model functions
# You can either save your trained model or import the classifier directly
# For this example, I'll assume you have a saved model

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your pre-trained model
# Option 1: If you have a saved model file
MODEL_PATH = 'model_artifacts/adhd_model.pkl'
SCALER_PATH = 'model_artifacts/adhd_scaler.pkl'
FEATURES_PATH = 'model_artifacts/feature_names.pkl'

if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            print(f" Model loaded from {MODEL_PATH}")
        except Exception as e:
            print(f" Error loading model: {e}")

if os.path.exists(SCALER_PATH):
        try:
            scaler = joblib.load(SCALER_PATH)
            print(f" Scaler loaded from {SCALER_PATH}")
        except Exception as e:
            print(f" Error loading scaler: {e}")

if os.path.exists(FEATURES_PATH):
        try:
            feature_names = joblib.load(FEATURES_PATH)
            print(f" Feature names loaded from {FEATURES_PATH}")
        except Exception as e:
            print(f" Error loading feature names, using defaults: {e}")

# Define the feature columns expected by your model
# These should match the features used in your ADHD_Classifier notebook

FEATURE_COLUMNS = [
    'age', 'gender', 'total_trials', 'total_correct', 'accuracy_percent',
       'mean_rt_ms', 'mean_mit_ms', 'mean_motor_leakage',
       'mean_inhibition_slope', 'mean_residual_motion',
       'mean_hesitation_count', 'mean_swerve_count', 'mean_arousal_stimulus',
       'mean_valence_response', 'mean_valence_delta', 'mean_arousal_delta',
       'mean_emotional_reactivity', 'highest_level', 'go_trials',
       'nogo_trials', 'correct_go', 'correct_nogo'
]

@app.route('/api/predict-adhd', methods=['POST'])
def predict_adhd():
    """
    Endpoint to predict ADHD based on session summary data
    """
    try:
        # Get the summary data from request
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Convert to DataFrame for processing
        df = pd.DataFrame([data])
        
        # Ensure all required features are present
        missing_features = [f for f in FEATURE_COLUMNS if f not in df.columns]
        if missing_features:
            return jsonify({
                'error': f'Missing features: {missing_features}'
            }), 400
        
        # Preprocess the data (match your notebook's preprocessing)
        # This should mirror the preprocessing in your ADHD_Classifier notebook
        
        # Handle gender encoding (if needed)
        if 'gender' in df.columns:
            df['gender'] = df['gender'].map({'M': 0, 'F': 1})
        
        # Select only the features used by your model
        X = df[FEATURE_COLUMNS]

        X_scaled = scaler.transform(X)
        X_scaled_df = pd.DataFrame(X_scaled, columns=FEATURE_COLUMNS)
        
        # Make prediction
        # If your model predicts probabilities
        if hasattr(model, 'predict_proba'):
            probabilities = model.predict_proba(X_scaled_df)[0]
            prediction = model.predict(X_scaled_df)[0]
            confidence = float(max(probabilities))
        else:
            prediction = model.predict(X_scaled_df)[0]
            confidence = None
        
        # Map prediction to meaningful output
        # Assuming 0 = Non-ADHD, 1 = ADHD (adjust based on your model)
        result = {
            'prediction': int(prediction),
            'adhd_status': 'ADHD' if prediction == 1 else 'Non-ADHD',
            'confidence': confidence,
            'session_id': data.get('session', 0),
            'timestamp': data.get('timestamp')
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)