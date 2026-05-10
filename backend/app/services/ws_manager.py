"""
WebSocket connection manager — broadcasts ticks to all connected clients.
"""
import asyncio
import json
from typing import Set
from fastapi import WebSocket
from app.services.engine import engine
from app.core.config import settings


class ConnectionManager:
    def __init__(self):
        self.active: Set[WebSocket] = set()

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.add(ws)

    def disconnect(self, ws: WebSocket):
        self.active.discard(ws)

    async def broadcast(self, message: dict):
        dead = set()
        for ws in self.active:
            try:
                await ws.send_json(message)
            except Exception:
                dead.add(ws)
        self.active -= dead


manager = ConnectionManager()


async def tick_loop():
    """Background task: advance simulation and broadcast every second."""
    while True:
        engine.advance_tick()

        snapshot   = engine.get_junction_snapshot()
        detections = engine.get_detections()
        predictions = engine.get_predictions()

        payload = {
            "type": "tick",
            "data": {
                "junction":    snapshot.model_dump(),
                "detections":  detections.model_dump(),
                "predictions": predictions.model_dump(),
                "vol_history": engine.get_vol_history(),
                "tick":        engine.tick,
            }
        }
        await manager.broadcast(payload)
        await asyncio.sleep(settings.WS_TICK_INTERVAL)