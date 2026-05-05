import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier

# 1. Load the baseline data and your trained "Brain"
df = pd.read_csv('adhd_sample_data_model.csv')
features = [
    "avg_click_interval", "click_variability_std", "inhibitory_failures", 
    "reflexive_fast_clicks", "total_mouse_distance", "total_errors", "perseverative_errors"
]
X = df[features]

# Make sure this matches whatever you named your latest model!
model = joblib.load('adhd_model_model.pkl') 

# 2. Ask the Brain to grade all the data
predictions = model.predict(X)

# 3. Train a "Translator" to reverse-engineer the Brain's logic
explainer = RandomForestClassifier(random_state=42).fit(X, predictions)

# 4. Print the exact percentages, sorted from highest to lowest!
print("\n🏆 WHICH COLUMNS DECIDE THE ADHD SCORE? 🏆")
print("=" * 45)
# Zip the feature names with their importance scores and sort them
importances = sorted(zip(features, explainer.feature_importances_), key=lambda x: x[1], reverse=True)

for name, importance in importances:
    print(f" -> {name.ljust(25)} : {importance * 100:.1f}%")
print("=" * 45 + "\n")