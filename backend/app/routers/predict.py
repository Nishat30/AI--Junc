from fastapi import APIRouter
import joblib
import numpy as np

router = APIRouter()

model = joblib.load("backend/app/ml/traffic_model.pkl")

@router.post("/predict")
def predict_traffic(data: dict):

    values = np.array([[
        data["north"],
        data["south"],
        data["east"],
        data["west"],
        data["rain"],
        data["event"]
    ]])

    prediction = model.predict(values)[0]

    return {
        "predicted_congestion": round(prediction, 2)
    }