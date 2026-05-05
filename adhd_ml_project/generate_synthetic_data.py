import pandas as pd
import numpy as np

# CONFIG
NUM_SAMPLES = 500  # We will generate 500 "fake" kids
OUTPUT_FILE = "adhd_sample_data_new.csv"

# Set random seed for reproducibility
np.random.seed(42)

print(f"Generating {NUM_SAMPLES} synthetic Neurotypical sessions...")

# --- GENERATE FEATURES FOR NEUROTYPICAL (NON-ADHD) PROFILE ---
# Neurotypical children tend to be consistent (low std dev) and have good impulse control.

# 1. Average Click Speed (ms)
# Normal distribution: Average 1200ms per click, +/- 200ms variation
avg_speed = np.random.normal(loc=1200, scale=200, size=NUM_SAMPLES)

# 2. Consistency (Standard Deviation) - CRITICAL FEATURE
# Neurotypicals are steady. Their variance is usually low (e.g., 200-400ms)
# We use a Gamma distribution because variance can't be negative
consistency = np.random.gamma(shape=2.0, scale=150, size=NUM_SAMPLES)

# 3. Invalid Clicks (Impulsivity)
# Neurotypicals rarely click locked boards. Using Poisson distribution (low count).
# Mostly 0, 1, or 2 clicks.
invalid_clicks = np.random.poisson(lam=1.5, size=NUM_SAMPLES)

# 4. Reflexive Fast Clicks (<200ms)
# Very rare for neurotypicals to click faster than human reaction time.
reflexive_clicks = np.random.poisson(lam=0.5, size=NUM_SAMPLES)

# 5. Mouse Distance
# Neurotypicals usually plan moves, so distance is moderate.
# Correlated with speed (faster players might move mouse less efficiently)
mouse_distance = (avg_speed * 3) + np.random.normal(0, 500, NUM_SAMPLES)

# 6. Total Errors (Working Memory)
# Average of 4-8 errors per game for a normal child
errors = np.random.poisson(lam=6, size=NUM_SAMPLES)

# 3. Inhibitory Failures (Hyperactivity) replacing invalid_clicks
inhibitory_fails = np.random.poisson(lam=0.5, size=NUM_SAMPLES)

# 8. Perseverative Errors (Working Memory)
# Neurotypicals rarely make the exact same mistake twice in a row
perseverative = np.random.poisson(lam=0.2, size=NUM_SAMPLES)

# 7. Total Score (NEW)
# Since the game finishes when all 8 pairs are found, the score is 8.
# We make it an array of 8s.
scores = np.full(NUM_SAMPLES, 8)


# --- ASSEMBLE DATAFRAME ---
df = pd.DataFrame({
    "username": [f"Simulated_User_{i}" for i in range(NUM_SAMPLES)],
    "level": np.random.choice([1, 2, 3], NUM_SAMPLES),
    "difficulty": np.random.choice(['easy', 'medium', 'hard', 'standard'], NUM_SAMPLES),
    "avg_click_interval": avg_speed.round(2),
    "click_variability_std": consistency.round(2),
    "total_invalid_clicks": invalid_clicks,
    "inhibitory_failures": inhibitory_fails,
    "reflexive_fast_clicks": reflexive_clicks,
    "total_mouse_distance": mouse_distance.round(2),
    "total_errors": errors,
    "perseverative_errors": perseverative,
    "total_score": scores
})

# --- OPTIONAL: ADD YOUR 5 REAL ROWS ---
# If you have real data, you can append it here to make it more "grounded"
try:
    real_data = pd.read_csv("adhd_training_data_REAL.csv") # Rename your existing file if needed
    df = pd.concat([df, real_data], ignore_index=True)
    print(f"Merged with real data.")
except FileNotFoundError:
    print("No real data file found to merge (that's okay).")

# --- SAVE TO CSV ---
df.to_csv(OUTPUT_FILE, index=False)
print(f"✅ Successfully saved {len(df)} rows to '{OUTPUT_FILE}'.")
print("You can now run 'python train_model.py'!")


