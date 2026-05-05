import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

# 1. LOAD THE DATA
# This is the CSV created by process_data.py
try:
    df = pd.read_csv('adhd_sample_data_model.csv')
    print(f"✅ Loaded {len(df)} sessions for training.")
except FileNotFoundError:
    print("❌ Error: 'adhd_sample_data.csv' not found. Run process_data.py first!")
    exit()

# 2. SELECT FEATURES
# We only want the numeric columns that describe behavior.
# We DO NOT include 'username' or 'total_score' in training because
# ADHD is about *how* they played, not *who* they are.
features = [
    "avg_click_interval", 
    "click_variability_std", 
    "inhibitory_failures",
    # "total_invalid_clicks", 
    "reflexive_fast_clicks",
    "total_mouse_distance",
    "total_errors",
    "perseverative_errors"    # Added Working Memory marker
]

X = df[features]

# 3. TRAIN THE MODEL (Isolation Forest)
# contamination=0.1 means we assume about 10% of our training data 
# might naturally be outliers (bad games, distractions, etc.)
print("Training the model...")
model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
model.fit(X)

# 4. SAVE THE MODEL
# This .pkl file is the "Brain" we will use later for predictions
joblib.dump(model, 'adhd_model_model.pkl')
print("✅ Model trained and saved to 'adhd_model.pkl'")
