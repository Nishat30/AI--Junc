from fastapi import APIRouter
from app.services.engine import engine

router = APIRouter(prefix="/junction", tags=["junction"])


@router.get("/snapshot")
def get_snapshot():
    return engine.get_junction_snapshot()


@router.get("/predictions")
def get_predictions():
    return engine.get_predictions()


@router.get("/volume-history")
def get_volume_history():
    return {"history": engine.get_vol_history()}


@router.post("/emergency")
def trigger_emergency():
    success = engine.trigger_emergency()
    return {"success": success, "message": "Emergency activated" if success else "Already active"}