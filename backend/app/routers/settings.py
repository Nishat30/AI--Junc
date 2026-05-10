from fastapi import APIRouter
from app.schemas import SystemSettings
from app.services.engine import engine

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/")
def get_settings():

    return {
        "success": True,
        "settings": engine.get_settings()
    }


@router.put("/")
def update_settings(s: SystemSettings):
    engine.update_settings(s)
    return {"success": True, "settings": engine.get_settings()}
