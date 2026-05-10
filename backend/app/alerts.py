from fastapi import APIRouter
from app.models.schemas import AlertRequest
from app.services.engine import engine

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/")
def get_alerts():
    return engine.get_alerts_data()


@router.post("/send")
def send_alert(req: AlertRequest):
    alert = engine.send_alert(req)
    return {"success": True, "alert": alert}