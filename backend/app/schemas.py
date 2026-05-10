from pydantic import BaseModel
from typing import List, Optional, Literal
from enum import Enum


class LaneDirection(str, Enum):
    NORTH = "north"
    SOUTH = "south"
    EAST = "east"
    WEST = "west"


class SignalPhase(str, Enum):
    NS_GREEN = "NS_GREEN"
    EW_GREEN = "EW_GREEN"
    ALL_RED = "ALL_RED"


class LaneStatus(str, Enum):
    LOW = "Low"
    MEDIUM = "Med"
    HIGH = "High"
    CRITICAL = "Critical"


class AIMode(str, Enum):
    ADAPTIVE = "Adaptive"
    FIXED = "Fixed"


# ── Lane ──
class LaneData(BaseModel):
    direction: LaneDirection
    density: float
    status: LaneStatus
    vehicle_count: int
    green_duration: int


# ── Signal ──
class SignalState(BaseModel):
    phase: SignalPhase
    countdown: int
    phase_duration: int
    phase_progress: float
    ai_mode: AIMode


# ── Junction snapshot ──
class JunctionSnapshot(BaseModel):
    junction_id: str
    name: str
    vehicles_per_min: int
    avg_wait_seconds: int
    efficiency_gain: float
    signal: SignalState
    lanes: List[LaneData]
    ai_cycles: int
    emergency_active: bool
    emergency_countdown: Optional[int]


# ── Detection ──
class DetectedObject(BaseModel):
    object_id: str
    type: Literal["car", "truck", "bike", "emergency"]
    confidence: float
    camera: str
    bbox_x: float
    bbox_y: float
    bbox_w: float
    bbox_h: float


class CameraFrame(BaseModel):
    camera_id: str
    label: str
    direction: LaneDirection
    density: float
    detections: List[DetectedObject]
    frame_ms: int


class DetectionSummary(BaseModel):
    total: int
    cars: int
    trucks: int
    bikes: int
    emergency: int
    frames: List[CameraFrame]


# ── Corridor ──
class JunctionStatus(str, Enum):
    ONLINE = "online"
    CONGESTED = "congested"
    CRITICAL = "critical"
    OFFLINE = "offline"


class CorridorJunction(BaseModel):
    id: str
    name: str
    x: float
    y: float
    status: JunctionStatus
    density: Optional[float] = None


class RoutesuggestionItem(BaseModel):
    description: str
    confidence: float
    active: bool
    type: Literal["divert", "sync", "pre-adjust"]


class CorridorData(BaseModel):
    junctions: List[CorridorJunction]
    throughput_per_hour: int
    avg_delay_minutes: float
    green_wave_synced: int
    total_junctions: int
    route_suggestions: List[RoutesuggestionItem]


# ── Weather ──
class WeatherImpactLevel(str, Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"


class WeatherCondition(BaseModel):
    label: str
    value: str
    impact: WeatherImpactLevel
    ai_action: str
    icon: str


class EventImpact(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    RESOLVED = "Resolved"


class TrafficEvent(BaseModel):
    title: str
    time: str
    details: str
    impact: EventImpact
    impact_score: float
    ai_action: str


class ForecastPoint(BaseModel):
    label: str
    impact: int
    color: str


class WeatherData(BaseModel):
    conditions: List[WeatherCondition]
    forecast: List[ForecastPoint]
    events: List[TrafficEvent]


# ── Alerts ──
class AlertType(str, Enum):
    CONGESTION = "Congestion warning"
    EMERGENCY = "Emergency vehicle alert"
    DIVERSION = "Route diversion"
    EVENT = "Event traffic advisory"
    CLEARANCE = "Incident clearance"


class AlertZone(str, Enum):
    ALL = "All commuters — JN-04 corridor"
    NORTH = "North approach only"
    EAST = "East approach only"
    CORRIDOR = "MG Road corridor (all junctions)"


class AlertRequest(BaseModel):
    alert_type: AlertType
    zone: AlertZone
    message: Optional[str] = None


class SentAlert(BaseModel):
    id: str
    alert_type: AlertType
    zone: AlertZone
    message: str
    recipient_count: int
    timestamp: str


class AlertsData(BaseModel):
    sent: List[SentAlert]
    total_sent: int


# ── Settings ──
class SystemSettings(BaseModel):
    adaptive_ai: bool = True
    emergency_detection: bool = True
    congestion_prediction: bool = True
    yolo_detection: bool = True
    corridor_sync: bool = True
    weather_adaptive: bool = True
    commuter_alerts: bool = True
    night_mode: bool = False
    pedestrian_priority: bool = False
    min_green_time: int = 15
    max_green_time: int = 45
    yolo_threshold: float = 72.0
    alert_sensitivity: int = 2
    weather_timing_boost: int = 15


# ── WebSocket message ──
class WSMessage(BaseModel):
    type: str
    data: dict


# ── Prediction ──
class PredictionItem(BaseModel):
    label: str
    probability: float
    color: str


class PredictionsData(BaseModel):
    items: List[PredictionItem]