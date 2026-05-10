from fastapi import APIRouter
from app.services.engine import engine

router = APIRouter(prefix="/camera", tags=["camera"])


@router.get("/detections")
def get_detections():
    return engine.get_detections()