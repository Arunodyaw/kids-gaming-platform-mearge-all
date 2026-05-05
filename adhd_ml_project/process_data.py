import pymongo
import pandas as pd
import numpy as np
import math

# ==========================================
# 1. CONFIGURATION
# ==========================================
# REPLACE THIS with your actual Atlas connection string
MONGO_URI = "mongodb+srv://gameadmin:0SUWKobwyF69Vbim@cluster0.yzm6vxn.mongodb.net/?appName=Cluster0"
DB_NAME = "test"         # Check your .env or Compass for exact name
COLLECTION_NAME = "gamesessions" # The collection where you saved the events

# ==========================================
# 2. FEATURE ENGINEERING LOGIC
# This function converts ONE game session (JSON) into ONE row of numbers
# ==========================================
def extract_features(session):
    events = session.get('events', [])
    
    # Filter specific event types based on your data structure
    # We only care about valid flips for speed, and invalid ones for impulsivity
    valid_flips = [e for e in events if e.get('eventType') == 'card_flip']
    invalid_clicks = [e for e in events if e.get('eventType') == 'invalid_click']
    mismatches = [e for e in events if e.get('eventType') == 'mismatch']

    # --- A. TIME & CONSISTENCY (The most important ADHD indicators) ---
    # We filter out times > 10 seconds (10000ms) as "distractions" rather than processing speed
    # intervals = [
    #     e.get('timeSinceLastAction', 0) 
    #     for e in valid_flips 
    #     if 0 < e.get('timeSinceLastAction', 0) < 10000
    # ]
    # --- A. TIME & CONSISTENCY (Using direct latencyMs!) ---
    # Grab the exact time it took between the 1st and 2nd click of a pair
    intervals = [
        e.get('latencyMs') 
        for e in events 
        if 'latencyMs' in e and 0 < e.get('latencyMs') < 10000
    ]

    if len(intervals) < 2:
        return None # Not enough data to analyze this session

    avg_speed = np.mean(intervals)        # General Speed
    variability = np.std(intervals)       # Consistency (Standard Deviation)

    # --- B. IMPULSIVITY (Inhibition Control) ---
    # 1. Count explicitly invalid clicks (clicking locked board)
    total_invalid = len(invalid_clicks)
    # Read the new hyperactivity tracker straight from the session root
    inhibitory_failures = session.get('inhibitoryFailures', 0)
    
    # 2. Count "Reflexive" clicks (clicking faster than humanly possible, < 200ms)
    reflexive_clicks = len([t for t in intervals if t < 200])

# --- C. WORKING MEMORY (Perseverative Errors) ---
    # Count how many times they repeated the exact same wrong guess
    perseverative_errors = len([e for e in mismatches if e.get('isPerseverative') == True])
    # --- C. MOTOR CONTROL / SPATIAL (Using your X/Y data) ---
    total_distance = 0
    mouse_efficiency_score = 0
    
    # Calculate distance between consecutive card flips
    for i in range(1, len(valid_flips)):
        # Your data has 'x' and 'y' directly in the event
        prev = valid_flips[i-1]
        curr = valid_flips[i]
        
        # Euclidean Distance Formula: sqrt((x2-x1)^2 + (y2-y1)^2)
        if 'x' in prev and 'x' in curr:
            dist = math.sqrt((curr['x'] - prev['x'])**2 + (curr['y'] - prev['y'])**2)
            total_distance += dist

    # --- D. WORKING MEMORY ---
    total_errors = len(mismatches)

    # RETURN THE ROW OF NUMBERS
    return {
        "username": session.get('username', 'unknown'),
        "level": session.get('level', 1),               # Save the context!
        "difficulty": session.get('difficulty', 'standard'),
        "avg_click_interval": round(avg_speed, 2),
        "click_variability_std": round(variability, 2), # Key ADHD Metric
        "total_invalid_clicks": total_invalid,          # Key ADHD Metric
        "inhibitory_failures": inhibitory_failures,
        "reflexive_fast_clicks": reflexive_clicks,
        "total_mouse_distance": round(total_distance, 2),
        "total_errors": total_errors,
        "perseverative_errors": perseverative_errors,
        "total_score": session.get('score', 0)
    }

# ==========================================
# 3. MAIN EXECUTION
# ==========================================
def main():
    print("Connecting to MongoDB Atlas...")
    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        # fetch all data
        # In the future, you can filter this: collection.find({"diagnosis": "neurotypical"})
        cursor = collection.find({})
        
        print("Fetching and processing sessions...")
        processed_data = []

        for session in cursor:
            features = extract_features(session)
            if features:
                processed_data.append(features)

        if not processed_data:
            print("No valid game sessions found to process.")
            return

        # Convert to Pandas DataFrame (Table format)
        df = pd.DataFrame(processed_data)

        # Save to CSV
        output_file = "adhd_training_data_new.csv"
        df.to_csv(output_file, index=False)
        
        print(f"\nSUCCESS! Processed {len(df)} sessions.")
        print(f"Data saved to: {output_file}")
        print("\nHere is a preview of your training data:")
        print(df.head())

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
