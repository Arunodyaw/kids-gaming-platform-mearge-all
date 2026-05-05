import sys
import os
import pymongo
import numpy as np
import math
import joblib
import pandas as pd

# CONFIG
MONGO_URI = "mongodb+srv://gameadmin:0SUWKobwyF69Vbim@cluster0.yzm6vxn.mongodb.net/?appName=Cluster0"
DB_NAME = "test"
COLLECTION_NAME = "gamesessions"

# CHECK ARGUMENTS
if len(sys.argv) < 2:
    print("Usage: python predict.py <username>")
    sys.exit(1)

target_user = sys.argv[1]

# --- FIX: GET ABSOLUTE PATH TO THE MODEL ---
# Get the folder where this script (predict.py) is located
script_dir = os.path.dirname(os.path.abspath(__file__))
# Combine it with the model filename
model_path = os.path.join(script_dir, 'adhd_model_model.pkl')


# 1. LOAD THE MODEL
try:
    model = joblib.load(model_path)
except FileNotFoundError:
    print(f"❌ Model not found at: {model_path}")
    print("❌ Model not found! Run train_model.py first.")
    sys.exit(1)

# 2. CONNECT TO DB & FETCH USER SESSION
client = pymongo.MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Get the most recent game for this user
session = collection.find_one(
    {"username": target_user},
    sort=[("playedAt", -1)] 
)

if not session:
    print(f"❌ No game data found for user: {target_user}")
    sys.exit(1)

# 3. EXTRACT FEATURES
# (This Logic MUST match process_data.py exactly)
events = session.get('events', [])
valid_flips = [e for e in events if e.get('eventType') == 'card_flip']
invalid_clicks = [e for e in events if e.get('eventType') == 'invalid_click']
mismatches = [e for e in events if e.get('eventType') == 'mismatch']

# intervals = [
#     e.get('timeSinceLastAction', 0) 
#     for e in valid_flips 
#     if 0 < e.get('timeSinceLastAction', 0) < 10000
# ]

intervals = [
    e.get('latencyMs') 
    for e in events 
    if 'latencyMs' in e and 0 < e.get('latencyMs') < 10000
]

if len(intervals) < 2:
    print("❌ Not enough moves in this session to analyze.")
    sys.exit(1)

# --- CALCULATE THE 6 NUMBERS ---
avg_speed = np.mean(intervals)
variability = np.std(intervals)
inhibitory_failures = session.get('inhibitoryFailures', 0)
# total_invalid = len(invalid_clicks)
reflexive_clicks = len([t for t in intervals if t < 200])
total_errors = len(mismatches)
perseverative_errors = len([e for e in mismatches if e.get('isPerseverative') == True])

total_distance = 0
for i in range(1, len(valid_flips)):
    prev = valid_flips[i-1]
    curr = valid_flips[i]
    if 'x' in prev and 'x' in curr:
        dist = math.sqrt((curr['x'] - prev['x'])**2 + (curr['y'] - prev['y'])**2)
        total_distance += dist

# Prepare the data for the model (Single Row)
features_df = pd.DataFrame([{
    "avg_click_interval": avg_speed,
    "click_variability_std": variability,
    "inhibitory_failures": inhibitory_failures,
    # "total_invalid_clicks": total_invalid,
    "reflexive_fast_clicks": reflexive_clicks,
    "total_mouse_distance": total_distance,
    "total_errors": total_errors,
    "perseverative_errors": perseverative_errors
}])

# 4. PREDICT
prediction = model.predict(features_df) # 1 = Normal, -1 = Anomaly
score = model.decision_function(features_df) # Lower score = More abnormal

# 5. OUTPUT REPORT
print("\n" + "="*40)
print(f"  SCREENING REPORT: {target_user}")
print("="*40)
print(f" Consistency (Std Dev):  {variability:.2f} ms  (Key Indicator)")
# print(f" Impulsive Clicks:       {total_invalid}")
print(f" Reflexive Clicks:       {reflexive_clicks}")
print(f" Perseverative Errors:   {perseverative_errors}")
print("-" * 40)

if prediction[0] == 1:
    print("RESULT: Neurotypical Pattern")
    print("   The gameplay behavior aligns with the baseline.")
else:
    print("RESULT: ANOMALY DETECTED")
    print("   Significant deviation from baseline observed.")
    if variability > 500:
        print("    -> High inconsistency in attention detected.")
    # if total_invalid > 3:
    #     print("    -> High impulsivity detected.")

print(f"\n (Model Confidence Score: {score[0]:.4f})")
print("="*40 + "\n")
