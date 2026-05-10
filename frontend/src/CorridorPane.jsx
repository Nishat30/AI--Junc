import { useEffect } from 'react'
import useStore from '../../store/useStore'

const STATUS_COLORS = {
  online:    '#1D9E75',
  congested: '#EF9F27',
  critical:  '#E24B4A',
  offline:   '#888',
}

const SVG_EDGES = [
  [12.9, 26.7, 30.6, 26.7],
  [30.6, 26.7, 50.8, 26.7],
  [50.8, 26.7, 68.5, 26.7],
  [12.9, 60.0, 30.6, 60.0],
  [30.6, 60.0, 50.8, 60.0],
  [50.8, 60.0, 68.5, 60.0],
  [30.6, 26.7, 30.6, 60.0],
  [50.8, 26.7, 50.8, 60.0],
  [68.5, 26.7, 68.5, 60.0],
  [12.9, 26.7, 12.9, 60.0],
  [68.5, 60.0, 87.0, 43.0],
]

export default function CorridorPane() {
  const corridor     = useStore(s => s.corridor)
  const fetchCorridor = useStore(s => s.fetchCorridor)

  useEffect(() => { fetchCorridor() }, [])

  const junctions    = corridor?.junctions ?? []
  const throughput   = corridor?.throughput_per_hour?.toLocaleString() ?? '—'
  const delay        = corridor?.avg_delay_minutes ?? '—'
  const synced       = corridor?.green_wave_synced ?? 6
  const suggestions  = corridor?.route_suggestions ?? []

  return (
    <>
      <div className="card mb12">
        <div className="ct"><i className="ti ti-map-2" /> Bengaluru junction corridor — 9 nodes</div>
        <div className="corr-map-wrap">
          {/* SVG edges */}
          <svg viewBox="0 0 100 80" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            {SVG_EDGES.map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#bbb" strokeWidth="0.8" />
            ))}
          </svg>
          {/* Node markers */}
          <div className="corr-nodes">
            {junctions.map(j => (
              <div
                key={j.id}
                className="jn-node"
                style={{ left: `${j.x}%`, top: `${j.y}%` }}
                title={`${j.id} — ${j.name} (${j.status})`}
              >
                <div
                  className="jn-node-dot"
                  style={{
                    background: STATUS_COLORS[j.status] ?? '#888',
                    outline: j.id === 'JN-04' ? '3px solid rgba(226,75,74,.35)' : undefined,
                  }}
                >
                  {j.id.slice(-2)}
                </div>
                <div className="jn-node-label">{j.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="corr-legend">
          {Object.entries(STATUS_COLORS).map(([s, c]) => (
            <span className="corr-legend-item" key={s}>
              <span className="corr-dot" style={{ background: c }} />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          ))}
        </div>
      </div>

      <div className="g3">
        <div className="mc"><div className="lbl">Corridor throughput</div><div className="val">{throughput}<span className="small-muted">/hr</span></div></div>
        <div className="mc"><div className="lbl">Avg corridor delay</div><div className="val">{delay}<span className="small-muted"> min</span></div></div>
        <div className="mc"><div className="lbl">Green wave synced</div><div className="val">{synced}<span className="small-muted">/9</span></div></div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="ct"><i className="ti ti-route" /> AI route suggestions</div>
        {suggestions.map((s, i) => {
          const cls  = s.type === 'divert' ? 'teal-bg' : s.type === 'sync' ? 'blue-bg' : 'amber-bg'
          const icol = s.type === 'divert' ? 'teal'    : s.type === 'sync' ? 'blue'    : 'amber'
          return (
            <div className="alert-item" key={i}>
              <div className={`ai-icon ${cls}`}>
                <i className={`ti ti-arrow-right ${icol}`} />
              </div>
              <div>
                <div className="at">{s.description}</div>
                <div className="atm">AI confidence: {s.confidence}% · {s.active ? 'Active' : 'Pending'}</div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}