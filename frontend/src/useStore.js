import { create } from 'zustand'

const WS_URL = 'ws://localhost:8000/ws/live'

const useStore = create((set, get) => ({
  // ── connection ──
  connected: false,
  tick: 0,

  // ── live data (from WS) ──
  junction: null,
  detections: null,
  predictions: null,
  volHistory: [],

  // ── static data (from REST) ──
  corridor: null,
  weather: null,
  alertsData: null,
  settings: null,

  // ── UI ──
  activeTab: 'main',
  ws: null,

  setTab: (tab) => set({ activeTab: tab }),

  // ── WebSocket ──
  connectWS: () => {
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      set({ connected: true, ws })
      console.log('[WS] Connected')
    }

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'tick') {
          set({
            junction:    msg.data.junction,
            detections:  msg.data.detections,
            predictions: msg.data.predictions,
            volHistory:  msg.data.vol_history,
            tick:        msg.data.tick,
          })
        }
      } catch (err) {
        console.error('[WS] parse error', err)
      }
    }

    ws.onclose = () => {
      set({ connected: false, ws: null })
      console.log('[WS] Disconnected — reconnecting in 2s')
      setTimeout(() => get().connectWS(), 2000)
    }

    ws.onerror = (e) => console.error('[WS] Error', e)
  },

  // ── REST fetchers ──
  fetchCorridor: async () => {
    const res = await fetch('/api/corridor/')
    const data = await res.json()
    set({ corridor: data })
  },

  fetchWeather: async () => {
    const res = await fetch('/api/weather/')
    const data = await res.json()
    set({ weather: data })
  },

  fetchAlerts: async () => {
    const res = await fetch('/api/alerts/')
    const data = await res.json()
    set({ alertsData: data })
  },

  fetchSettings: async () => {
    const res = await fetch('/api/settings/')
    const data = await res.json()
    set({ settings: data })
  },

  triggerEmergency: async () => {
    await fetch('/api/junction/emergency', { method: 'POST' })
  },

  sendAlert: async (payload) => {
    const res = await fetch('/api/alerts/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.success) {
      await get().fetchAlerts()
    }
    return data
  },

  updateSettings: async (newSettings) => {
    const res = await fetch('/api/settings/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    })
    const data = await res.json()
    if (data.success) set({ settings: data.settings })
  },
}))

export default useStore