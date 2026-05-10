from fastapi import APIRouter
from app.services.engine import engine

router = APIRouter(prefix="/corridor", tags=["corridor"])


@router.get("/")
def get_corridor():
    return engine.get_corridor()