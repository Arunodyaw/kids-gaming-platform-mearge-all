import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split
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

# --- NEW: 3. THE TRAIN/TEST SPLIT ---
# test_size=0.2 means 20% is hidden for testing, 80% is used for training.
# random_state=42 ensures it shuffles the exact same way every time you run it.
X_train, X_test = train_test_split(X, test_size=0.2, random_state=42)

print(f" Training the model on {len(X_train)} sessions...")
print(f" Reserving {len(X_test)} sessions for the blind test...")

# 4. TRAIN THE MODEL (Isolation Forest)
# contamination=0.1 means we expect roughly 10% of our data might naturally be messy
model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)

# WE ONLY GIVE IT THE 80% STUDY GUIDE (X_train)
model.fit(X_train)
# --- NEW: 5. TEST THE MODEL ---
# Ask the model to predict the 20% it has never seen before
print("\nAdministering blind test to the model...")
predictions = model.predict(X_test)

# In an Isolation Forest: 1 = Normal, -1 = Anomaly
normal_count = list(predictions).count(1)
anomaly_count = list(predictions).count(-1)

print("\n BLIND TEST RESULTS (On unseen data):")
print(f" -> Identified as Neurotypical Pattern: {normal_count}")
print(f" -> Flagged as Potential Anomaly: {anomaly_count}")
print(f" -> Anomaly Rate: {(anomaly_count / len(predictions)) * 100:.1f}%\n")

# 6. SAVE THE MODEL
joblib.dump(model, 'adhd_model_test.pkl')
print("✅ Model trained, tested, and saved to 'adhd_model.pkl'")