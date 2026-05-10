import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

# Load dataset

df = pd.read_csv("backend/data/traffic_data.csv")

X = df[["north", "south", "east", "west", "rain", "event"]]
y = df["congestion"]

# Split data

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train model

model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)

# Predict

predictions = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, predictions))

# Save model

joblib.dump(model, "backend/app/ml/traffic_model.pkl")

print("Model trained successfully")