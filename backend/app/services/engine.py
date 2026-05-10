"""
Junction AI — Simulation Engine
Manages real-time state for lanes, signals, detections, predictions.
"""
import random
import math
import time
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from app.schemas import (
    LaneData, LaneDirection, LaneStatus, SignalPhase, SignalState,
    AIMode, JunctionSnapshot, DetectedObject, CameraFrame,
    DetectionSummary, CorridorJunction, CorridorData, JunctionStatus,
    RoutesuggestionItem, WeatherData, WeatherCondition, WeatherImpactLevel,
    TrafficEvent, EventImpact, ForecastPoint, SentAlert, AlertsData,
    AlertType, AlertZone, AlertRequest, SystemSettings, PredictionItem,
    PredictionsData
)


class SimulationEngine:
    def __init__(self):
        self.settings = SystemSettings()
        self.tick = 0
        self.phase = SignalPhase.NS_GREEN
        self.phase_duration = 30
        self.countdown = 30
        self.ai_cycles = 0
        self.emergency_active = False
        self.emergency_countdown = 0

        self.lanes: Dict[LaneDirection, float] = {
            LaneDirection.NORTH: 72.0,
            LaneDirection.SOUTH: 45.0,
            LaneDirection.EAST: 88.0,
            LaneDirection.WEST: 60.0,
        }

        self.vehicles_per_min = 142
        self.avg_wait = 24
        self.ai_cycles_count = 847
        self.total_detections = 0

        self.sent_alerts: List[SentAlert] = [
            SentAlert(
                id=str(uuid.uuid4()),
                alert_type=AlertType.CONGESTION,
                zone=AlertZone.EAST,
                message="East approach heavy. Take Residency Rd for faster route.",
                recipient_count=2841,
                timestamp="4 min ago"
            ),
            SentAlert(
                id=str(uuid.uuid4()),
                alert_type=AlertType.DIVERSION,
                zone=AlertZone.CORRIDOR,
                message="MG Rd corridor — use Cunningham Rd until 20:00.",
                recipient_count=5102,
                timestamp="22 min ago"
            ),
        ]
        self.total_alerts_sent = 14

        self.vol_history: List[int] = [
            110, 125, 118, 142, 138, 155, 162,
            148, 157, 170, 165, 142, 138, 151
        ]

        self._junctions = [
            {"id": "JN-01", "name": "Silk Board",   "x": 12.9, "y": 26.7, "status": JunctionStatus.CONGESTED},
            {"id": "JN-02", "name": "Koramangala",  "x": 30.6, "y": 26.7, "status": JunctionStatus.ONLINE},
            {"id": "JN-03", "name": "Forum Mall",   "x": 50.8, "y": 26.7, "status": JunctionStatus.ONLINE},
            {"id": "JN-04", "name": "MG×Brigade",   "x": 68.5, "y": 26.7, "status": JunctionStatus.CRITICAL},
            {"id": "JN-05", "name": "Residency",    "x": 12.9, "y": 60.0, "status": JunctionStatus.ONLINE},
            {"id": "JN-06", "name": "Lavelle",      "x": 30.6, "y": 60.0, "status": JunctionStatus.ONLINE},
            {"id": "JN-07", "name": "Cubbon Pk",    "x": 50.8, "y": 60.0, "status": JunctionStatus.CONGESTED},
            {"id": "JN-08", "name": "St. Marks",    "x": 68.5, "y": 60.0, "status": JunctionStatus.ONLINE},
            {"id": "JN-09", "name": "BBMP Rd",      "x": 87.0, "y": 43.0, "status": JunctionStatus.OFFLINE},
        ]

    # ── tick ──────────────────────────────────────────────────────────────────
    def advance_tick(self):
        self.tick += 1

        # fluctuate lane densities
        for d in self.lanes:
            self.lanes[d] = max(5.0, min(98.0, self.lanes[d] + (random.random() - 0.45) * 7))

        # emergency countdown
        if self.emergency_active:
            self.emergency_countdown -= 1
            if self.emergency_countdown <= 0:
                self.emergency_active = False
                self.emergency_countdown = 0
                self._resume_phase()
            return

        # signal phase countdown
        self.countdown -= 1
        if self.countdown <= 0:
            self._switch_phase()

        # update metrics every 10 ticks
        if self.tick % 10 == 0:
            self.vehicles_per_min = random.randint(100, 190)
            self.avg_wait = random.randint(16, 32)
            new_vol = random.randint(100, 190)
            self.vol_history.append(new_vol)
            if len(self.vol_history) > 20:
                self.vol_history.pop(0)
            self.ai_cycles_count += 1

    def _switch_phase(self):
        self.phase = SignalPhase.EW_GREEN if self.phase == SignalPhase.NS_GREEN else SignalPhase.NS_GREEN
        if self.settings.adaptive_ai:
            ns = (self.lanes[LaneDirection.NORTH] + self.lanes[LaneDirection.SOUTH]) / 2
            ew = (self.lanes[LaneDirection.EAST] + self.lanes[LaneDirection.WEST]) / 2
            load = ns if self.phase == SignalPhase.NS_GREEN else ew
            self.phase_duration = int(
                self.settings.min_green_time +
                (load / 100) * (self.settings.max_green_time - self.settings.min_green_time)
            )
        else:
            self.phase_duration = 30
        self.countdown = self.phase_duration

    def _resume_phase(self):
        self.phase = SignalPhase.NS_GREEN
        self.phase_duration = 30
        self.countdown = 30

    # ── actions ───────────────────────────────────────────────────────────────
    def trigger_emergency(self):
        if self.emergency_active:
            return False
        self.emergency_active = True
        self.emergency_countdown = 12
        self.phase = SignalPhase.ALL_RED
        return True

    def send_alert(self, req: AlertRequest) -> SentAlert:
        import random
        msg = req.message or req.alert_type.value
        alert = SentAlert(
            id=str(uuid.uuid4()),
            alert_type=req.alert_type,
            zone=req.zone,
            message=msg,
            recipient_count=random.randint(1000, 6000),
            timestamp="Just now"
        )
        self.sent_alerts.insert(0, alert)
        if len(self.sent_alerts) > 20:
            self.sent_alerts.pop()
        self.total_alerts_sent += 1
        return alert

    def update_settings(self, s: SystemSettings):
        self.settings = s

    # ── snapshots ─────────────────────────────────────────────────────────────
    def get_junction_snapshot(self) -> JunctionSnapshot:
        lanes = []
        for d, density in self.lanes.items():
            if density > 80:
                status = LaneStatus.CRITICAL
            elif density > 65:
                status = LaneStatus.HIGH
            elif density > 45:
                status = LaneStatus.MEDIUM
            else:
                status = LaneStatus.LOW
            lanes.append(LaneData(
                direction=d,
                density=round(density, 1),
                status=status,
                vehicle_count=int(density / 10),
                green_duration=int(15 + (density / 100) * 30),
            ))

        progress = ((self.phase_duration - self.countdown) / self.phase_duration) * 100 if self.phase_duration else 0

        signal = SignalState(
            phase=self.phase,
            countdown=self.countdown,
            phase_duration=self.phase_duration,
            phase_progress=round(progress, 1),
            ai_mode=AIMode.ADAPTIVE if self.settings.adaptive_ai else AIMode.FIXED,
        )

        return JunctionSnapshot(
            junction_id="JN-04",
            name="MG Road × Brigade Road",
            vehicles_per_min=self.vehicles_per_min,
            avg_wait_seconds=self.avg_wait,
            efficiency_gain=31.0,
            signal=signal,
            lanes=lanes,
            ai_cycles=self.ai_cycles_count,
            emergency_active=self.emergency_active,
            emergency_countdown=self.emergency_countdown if self.emergency_active else None,
        )

    def get_detections(self) -> DetectionSummary:
        cam_dirs = [
            (LaneDirection.NORTH, "CAM-01", "North approach"),
            (LaneDirection.EAST,  "CAM-02", "East approach"),
            (LaneDirection.SOUTH, "CAM-03", "South approach"),
            (LaneDirection.WEST,  "CAM-04", "West approach"),
        ]
        frames = []
        total = cars = trucks = bikes = emerg = 0

        for direction, cam_id, label in cam_dirs:
            density = self.lanes[direction]
            num = max(1, int(density / 10))
            detections = []
            for _ in range(num):
                r = random.random()
                if r < 0.1:
                    obj_type = "truck"
                    trucks += 1
                elif r < 0.2:
                    obj_type = "bike"
                    bikes += 1
                elif r < 0.22 and self.emergency_active:
                    obj_type = "emergency"
                    emerg += 1
                else:
                    obj_type = "car"
                    cars += 1
                total += 1
                detections.append(DetectedObject(
                    object_id=str(uuid.uuid4())[:8],
                    type=obj_type,
                    confidence=round(random.uniform(0.82, 0.99), 2),
                    camera=cam_id,
                    bbox_x=round(random.uniform(0.05, 0.85), 3),
                    bbox_y=round(random.uniform(0.05, 0.85), 3),
                    bbox_w=round(random.uniform(0.06, 0.15), 3),
                    bbox_h=round(random.uniform(0.04, 0.10), 3),
                ))
            frames.append(CameraFrame(
                camera_id=cam_id,
                label=label,
                direction=direction,
                density=round(density, 1),
                detections=detections,
                frame_ms=random.randint(28, 48),
            ))

        self.total_detections = total
        return DetectionSummary(total=total, cars=cars, trucks=trucks, bikes=bikes, emergency=emerg, frames=frames)

    def get_corridor(self) -> CorridorData:
        junctions = []
        for j in self._junctions:
            # randomly fluctuate status for non-key junctions
            status = j["status"]
            junctions.append(CorridorJunction(
                id=j["id"], name=j["name"],
                x=j["x"], y=j["y"],
                status=status,
                density=round(random.uniform(30, 90), 1) if status != JunctionStatus.OFFLINE else None,
            ))
        return CorridorData(
            junctions=junctions,
            throughput_per_hour=random.randint(1200, 1400),
            avg_delay_minutes=round(random.uniform(2.0, 5.0), 1),
            green_wave_synced=6,
            total_junctions=9,
            route_suggestions=[
                RoutesuggestionItem(description="Divert 30% of E-bound traffic via Residency Rd — saves est. 4 min", confidence=88, active=True, type="divert"),
                RoutesuggestionItem(description="Green wave sync enabled across JN-02→JN-05 corridor (MG Rd)", confidence=92, active=True, type="sync"),
                RoutesuggestionItem(description="JN-07 nearing saturation — pre-extending N-bound phase by 8s", confidence=74, active=False, type="pre-adjust"),
            ]
        )

    def get_weather(self) -> WeatherData:
        return WeatherData(
            conditions=[
                WeatherCondition(label="Light rain · 18°C", value="Visibility 800m", impact=WeatherImpactLevel.MODERATE, ai_action="AI extended cycle times +15%", icon="cloud-rain"),
                WeatherCondition(label="Wind 22 km/h SW", value="No significant impact", impact=WeatherImpactLevel.LOW, ai_action="No change", icon="wind"),
                WeatherCondition(label="Humidity 84%", value="Camera IR compensation active", impact=WeatherImpactLevel.LOW, ai_action="IR mode on cameras enabled", icon="droplet"),
            ],
            forecast=[
                ForecastPoint(label="Now",  impact=65, color="#378ADD"),
                ForecastPoint(label="+1h",  impact=72, color="#378ADD"),
                ForecastPoint(label="+2h",  impact=58, color="#1D9E75"),
                ForecastPoint(label="+3h",  impact=88, color="#E24B4A"),
                ForecastPoint(label="+4h",  impact=95, color="#E24B4A"),
                ForecastPoint(label="+5h",  impact=80, color="#EF9F27"),
            ],
            events=[
                TrafficEvent(title="IPL Match — Chinnaswamy Stadium", time="19:30 – 23:00", details="40,000 attendees · 1.2km from JN-04", impact=EventImpact.HIGH, impact_score=0.85, ai_action="E-bound phase +20s from 18:45; post-event surge plan loaded"),
                TrafficEvent(title="Commercial District peak hour", time="17:00 – 19:30", details="Brigade Rd & MG Rd", impact=EventImpact.MEDIUM, impact_score=0.58, ai_action="Adaptive timing engaged; pedestrian phase extended by 6s"),
                TrafficEvent(title="Road maintenance — Residency Rd", time="08:00 – 14:00", details="Lane 2 closed", impact=EventImpact.RESOLVED, impact_score=0.20, ai_action="Alternate route suggestion lifted at 14:12"),
            ]
        )

    def get_predictions(self) -> PredictionsData:
        ns = (self.lanes[LaneDirection.NORTH] + self.lanes[LaneDirection.SOUTH]) / 2
        ew = (self.lanes[LaneDirection.EAST] + self.lanes[LaneDirection.WEST]) / 2
        cong = min(99, int((ns + ew) / 2 * 1.1))
        queue = min(99, int(ew * 0.8))
        incident = max(5, int(random.uniform(10, 35)))
        return PredictionsData(items=[
            PredictionItem(label="Congestion 8m",  probability=cong,    color="#E24B4A"),
            PredictionItem(label="Queue overflow",  probability=queue,   color="#EF9F27"),
            PredictionItem(label="Incident risk",   probability=incident, color="#1D9E75"),
        ])

    def get_alerts_data(self) -> AlertsData:
        return AlertsData(sent=self.sent_alerts[:10], total_sent=self.total_alerts_sent)

    def get_settings(self) -> SystemSettings:
        return self.settings

    def get_vol_history(self) -> List[int]:
        return self.vol_history[-14:]


# Singleton
engine = SimulationEngine()