# 🚦 AI--Junc — AI-Based Junction Traffic Optimization System

A real-time traffic junction management system powered by AI. It simulates smart traffic signal control, camera detections, corridor mapping, weather awareness, and commuter alerts — all streamed live via WebSocket.

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Zustand, Recharts |
| Backend | FastAPI, Uvicorn, WebSockets |
| Styling | CSS, Tabler Icons |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
AI--Junc/
├── backend/
│   ├── app/
│   │   ├── core/          # Config & settings
│   │   ├── ml/            # ML optimizer & model training
│   │   ├── routers/       # API routes (junction, camera, corridor, weather, alerts, settings)
│   │   ├── services/      # Engine & WebSocket manager
│   │   ├── main.py        # FastAPI app entry point
│   │   └── schemas.py     # Pydantic models
│   ├── data/              # Traffic data CSV
│   ├── .env               # Environment variables (not committed)
│   ├── requirement.txt    # Python dependencies
│   └── run.py             # Uvicorn launcher
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Alerts/    # Commuter alerts panel
│   │   │   ├── Camera/    # Camera / YOLO detections
│   │   │   ├── Corridor/  # Corridor map
│   │   │   ├── Junction/  # Main junction view
│   │   │   ├── Settings/  # System settings
│   │   │   ├── Weather/   # Weather & events
│   │   │   ├── shared/    # Shared UI components & styles
│   │   │   └── store/     # Zustand global store
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env               # Local env vars (not committed)
│   ├── vite.config.js
│   └── package.json
│
└── .gitignore
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.11+ (or 3.13 with pre-built wheels)
- Node.js 18+

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
venv\Scripts\Activate.ps1

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn[standard] websockets pydantic pydantic-settings python-dotenv httpx

# Start server
python run.py
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## ⚙️ Environment Variables

### `backend/.env`
```
APP_NAME="Junction AI"
APP_VERSION="2.0.0"
DEBUG=True
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=["http://localhost:5173"]
WS_TICK_INTERVAL=1.0
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Root health check |
| GET | `/api/junction/snapshot` | Current junction state |
| GET | `/api/junction/predictions` | AI traffic predictions |
| POST | `/api/junction/emergency` | Trigger emergency mode |
| GET | `/api/camera/detections` | YOLO camera detections |
| GET | `/api/corridor/` | Corridor map data |
| GET | `/api/weather/` | Weather & events |
| GET | `/api/alerts/` | Commuter alerts |
| POST | `/api/alerts/send` | Send a new alert |
| GET | `/api/settings/` | Get system settings |
| PUT | `/api/settings/` | Update system settings |
| WS | `/ws/live` | Live WebSocket tick stream |

---

## ☁️ Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | `https://ai-junc.vercel.app` |
| Backend | Render | `https://ai-junc-backend.onrender.com` |

### Deploy Backend (Render)
- Root Directory: `backend`
- Build Command: `pip install fastapi uvicorn[standard] websockets pydantic pydantic-settings python-dotenv httpx`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`

### Deploy Frontend (Vercel)
- Root Directory: `frontend`
- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_URL` = `https://ai-junc-backend.onrender.com`
  - `VITE_WS_URL` = `wss://ai-junc-backend.onrender.com`

---

## 📡 WebSocket

The backend pushes live traffic ticks every second to all connected clients via `/ws/live`. The frontend auto-reconnects if the connection drops.

```json
{
  "type": "tick",
  "data": {
    "junction": { ... },
    "detections": { ... },
    "predictions": { ... },
    "vol_history": [ ... ],
    "tick": 42
  }
}
```

---

## 👥 Team

- **Nishat30** — Original author
- **emcc2302** — Contributor
- **shafaq16** — Contributor

## Screenshots
<img width="1917" height="915" alt="image" src="https://github.com/user-attachments/assets/7669653c-123e-492d-a31d-d539100ed7d6" />

---
<img width="1918" height="910" alt="image" src="https://github.com/user-attachments/assets/72d8329a-922d-4362-9cee-94e98aa2437e" />



---

## 📄 License

This project is for educational and demonstration purposes.
