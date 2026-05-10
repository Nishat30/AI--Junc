from fastapi import APIRouter
from app.services.engine import engine

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/")
def get_weather():
    return engine.get_weather()