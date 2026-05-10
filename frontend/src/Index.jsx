import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import useStore from '../../store/useStore'

// ── Predictions ──────────────────────────────────────────────────────────────
export function PredictionsCard() {
  const predictions = useStore(s => s.predictions)
  const items = predictions?.items ?? [
    { label: 'Congestion 8m', probability: 87, color: '#E24B4A' },
    { label: 'Queue overflow', probability: 61, color: '#EF9F27' },
    { label: 'Incident risk',  probability: 23, color: '#1D9E75' },
  ]

  return (
    <div className="card">
      <div className="ct"><i className="ti ti-brain" /> AI prediction</div>
      {items.map((item, i) => (
        <div className="predict-item" key={i}>
          <div className="predict-pct" style={{ color: item.color }}>{item.probability}%</div>
          <div className="predict-bar-wrap">
            <div className="predict-bar" style={{ background: item.color, width: `${item.probability}%` }} />
          </div>
          <div className="predict-lbl">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Volume Chart ─────────────────────────────────────────────────────────────
export function VolumeChart() {
  const history = useStore(s => s.volHistory)
  const data = history.map((v, i) => ({ name: `C${i + 1}`, vehicles: v }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,.15)" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} />
        <YAxis domain={[80, 210]} tick={{ fontSize: 10, fill: '#888' }} />
        <Tooltip
          contentStyle={{ fontSize: 11, background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: 6 }}
        />
        <Line type="monotone" dataKey="vehicles" stroke="#378ADD" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Event Log ─────────────────────────────────────────────────────────────────
const INITIAL_LOGS = [
  { icon: 'check',          bgClass: 'teal-bg', colorClass: 'teal', msg: 'AI extended N–S green by 12s — density 78%',         time: 'Just now' },
  { icon: 'alert-triangle', bgClass: 'amber-bg', colorClass: 'amber', msg: 'East congestion predicted — pre-adjusting cycle',   time: '1 min ago' },
  { icon: 'ambulance',      bgClass: 'red-bg',   colorClass: 'red',   msg: 'Emergency corridor opened — Ambulance cleared',     time: '6 min ago' },
  { icon: 'brain',          bgClass: 'blue-bg',  colorClass: 'blue',  msg: 'AI retrained on last 2hr data · accuracy 94.2%',   time: '22 min ago' },
]

export function EventLog() {
  return (
    <div>
      {INITIAL_LOGS.map((l, i) => (
        <div className="alert-item" key={i}>
          <div className={`ai-icon ${l.bgClass}`}>
            <i className={`ti ti-${l.icon} ${l.colorClass}`} />
          </div>
          <div>
            <div className="at">{l.msg}</div>
            <div className="atm">{l.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Lane Density Table ────────────────────────────────────────────────────────
const BAR_COLORS = { north: 'blue', south: 'teal-bar', east: 'amber-bar', west: 'red-bar' }
const BADGE_CLASS = (status) => {
  if (status === 'Critical') return 'badge br'
  if (status === 'High' || status === 'Med') return 'badge ba'
  return 'badge bg'
}

export function LaneDensityTable() {
  const lanes = useStore(s => s.junction?.lanes) ?? []
  const display = lanes.length ? lanes : [
    { direction: 'north', density: 72, status: 'High' },
    { direction: 'south', density: 45, status: 'Low'  },
    { direction: 'east',  density: 88, status: 'Critical' },
    { direction: 'west',  density: 60, status: 'Med'  },
  ]

  return (
    <table className="lane-table">
      <thead><tr><th>Lane</th><th>Load</th><th>Status</th></tr></thead>
      <tbody>
        {display.map(l => (
          <tr key={l.direction}>
            <td style={{ textTransform: 'capitalize' }}>{l.direction}</td>
            <td>
              <div
                className={`density-bar ${BAR_COLORS[l.direction] ?? 'blue'}`}
                style={{ width: `${Math.round(l.density)}px` }}
              />
            </td>
            <td><span className={BADGE_CLASS(l.status)}>{l.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PredictionsCard