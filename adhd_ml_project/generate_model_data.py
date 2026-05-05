import pymongo
import pandas as pd
import numpy as np
import math

# ==========================================
# 1. CONFIGURATION
# ==========================================
MONGO_URI = "mongodb+srv://gameadmin:0SUWKobwyF69Vbim@cluster0.yzm6vxn.mongodb.net/?appName=Cluster0"
DB_NAME = "test"
COLLECTION_NAME = "gamesessions"
TARGET_USERNAME = "aaa" # <--- PUT YOUR TEST USERNAME HERE
NUM_CLONES = 500
OUTPUT_FILE = "adhd_sample_data_model.csv"

np.random.seed(42)

# ==========================================
# 2. FEATURE EXTRACTION (Same as process_data.py)
# ==========================================
def extract_features(session):
    events = session.get('events', [])
    valid_flips = [e for e in events if e.get('eventType') == 'card_flip']
    mismatches = [e for e in events if e.get('eventType') == 'mismatch']

    intervals = [e.get('latencyMs') for e in events if 'latencyMs' in e and 0 < e.get('latencyMs') < 10000]
    if len(intervals) < 2: return None 

    avg_speed = np.mean(intervals)        
    variability = np.std(intervals)       
    inhibitory_failures = session.get('inhibitoryFailures', 0)
    reflexive_clicks = len([t for t in intervals if t < 200])
    perseverative_errors = len([e for e in mismatches if e.get('isPerseverative') == True])

    total_distance = 0
    for i in range(1, len(valid_flips)):
        prev, curr = valid_flips[i-1], valid_flips[i]
        if 'x' in prev and 'x' in curr:
            total_distance += math.sqrt((curr['x'] - prev['x'])**2 + (curr['y'] - prev['y'])**2)

    return {
        "avg_click_interval": avg_speed,
        "click_variability_std": variability,
        "inhibitory_failures": inhibitory_failures,
        "reflexive_fast_clicks": reflexive_clicks,
        "total_mouse_distance": total_distance,
        "total_errors": len(mismatches),
        "perseverative_errors": perseverative_errors
    }

# ==========================================
# 3. FETCH YOUR DATA & CLONE IT
# ==========================================
print(f"Fetching real games for user '{TARGET_USERNAME}' from MongoDB...")
client = pymongo.MongoClient(MONGO_URI)
db = client[DB_NAME]
cursor = db[COLLECTION_NAME].find({"username": TARGET_USERNAME})

real_sessions = []
for session in cursor:
    features = extract_features(session)
    if features:
        real_sessions.append(features)

if len(real_sessions) < 2:
    print(f"❌ Error: Need at least 2 complete games from {TARGET_USERNAME} to calculate an average baseline. Go play more!")
    exit()

# Convert your real games into a DataFrame
real_df = pd.DataFrame(real_sessions)
print(f"✅ Found {len(real_df)} valid games. Calculating your brain's baseline...")

# Calculate the Mean (Average) and Standard Deviation (Spread) of YOUR gameplay
means = real_df.mean()
stds = real_df.std()

# Replace any NaN std deviations (if you played exactly the same every time) with a small baseline
stds = stds.replace(0, 0.1).fillna(0.1)

print(f"Generating {NUM_CLONES} synthetic clones based on your playstyle...")

# Generate the clones using normal distributions centered around YOUR averages!
synthetic_data = {
    "username": [f"Simulated_Clone_{i}" for i in range(NUM_CLONES)],
    
    # We use abs() to prevent impossible negative numbers
    "avg_click_interval": np.abs(np.random.normal(means["avg_click_interval"], stds["avg_click_interval"], NUM_CLONES)),
    "click_variability_std": np.abs(np.random.normal(means["click_variability_std"], stds["click_variability_std"], NUM_CLONES)),
    
    # For counts (errors, failures), we use Poisson distribution centered on your average
    "inhibitory_failures": np.random.poisson(lam=max(0.1, means["inhibitory_failures"]), size=NUM_CLONES),
    "reflexive_fast_clicks": np.random.poisson(lam=max(0.1, means["reflexive_fast_clicks"]), size=NUM_CLONES),
    "total_errors": np.random.poisson(lam=max(0.1, means["total_errors"]), size=NUM_CLONES),
    "perseverative_errors": np.random.poisson(lam=max(0.1, means["perseverative_errors"]), size=NUM_CLONES),
    
    "total_mouse_distance": np.abs(np.random.normal(means["total_mouse_distance"], stds["total_mouse_distance"], NUM_CLONES)),
    "total_score": np.full(NUM_CLONES, 8) # Assuming a win is 8 matches
}

synth_df = pd.DataFrame(synthetic_data)

# Save to CSV
synth_df.to_csv(OUTPUT_FILE, index=False)
print(f"✅ Successfully saved {NUM_CLONES} personalized baseline rows to '{OUTPUT_FILE}'.")
print("\nYour baseline averages:")
print(means.round(2))
print("\nYou can now run 'python train_model.py' to train the brain on YOUR playstyle!")