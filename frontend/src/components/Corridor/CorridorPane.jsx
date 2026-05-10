import React, { useEffect } from 'react'
import useStore from '../store/useStore'

const STATUS_COLORS = {
  online: '#1D9E75',
  congested: '#EF9F27',
  critical: '#E24B4A',
  offline: '#888',
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

  const corridor = useStore(s => s.corridor)
  const fetchCorridor = useStore(s => s.fetchCorridor)

  useEffect(() => {
    fetchCorridor()
  }, [])

  console.log('CORRIDOR DATA:', corridor)

  const junctions =
    corridor?.junctions ||
    corridor?.nodes ||
    []

  const throughput =
    corridor?.throughput_per_hour ||
    corridor?.throughput ||
    '—'

  const delay =
    corridor?.avg_delay_minutes ||
    corridor?.avg_delay ||
    '—'

  const synced =
    corridor?.green_wave_synced ||
    corridor?.green_wave ||
    6

  const suggestions =
    corridor?.route_suggestions ||
    []

  return (
    <>
      <div className="card mb12">

        <div className="ct">
          <i className="ti ti-map-2" />
          Bengaluru junction corridor — 9 nodes
        </div>


        {/* MAP */}
        <div
          className="corr-map-wrap"
          style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            background: '#ECE9E2',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >

          {/* SVG EDGES */}
          <svg
            viewBox="0 0 100 80"
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            {SVG_EDGES.map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#999"
                strokeWidth="0.8"
              />
            ))}
          </svg>

          {/* NODES */}
          <div className="corr-nodes">

            {junctions.length === 0 && (
              <div
                style={{
                  color: '#000',
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  fontWeight: 'bold',
                }}
              >
                No junction data received
              </div>
            )}

            {junctions.map(j => (
              <div
                key={j.id}
                className="jn-node"
                style={{
                  position: 'absolute',
                  left: `${j.x}%`,
                  top: `${j.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                title={`${j.id} — ${j.name}`}
              >

                <div
                  className="jn-node-dot"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: STATUS_COLORS[j.status] || '#888',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    border: '3px solid rgba(255,255,255,.2)',
                    boxShadow: '0 0 20px rgba(0,0,0,.25)',
                  }}
                >
                  {j.id.slice(-2)}
                </div>

                <div
                  className="jn-node-label"
                  style={{
                    marginTop: 6,
                    color: '#111',
                    fontSize: 12,
                    fontWeight: 600,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {j.name}
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* LEGEND */}
        <div className="corr-legend" style={{ marginTop: 16 }}>
          {Object.entries(STATUS_COLORS).map(([s, c]) => (
            <span
              className="corr-legend-item"
              key={s}
              style={{
                marginRight: 18,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                className="corr-dot"
                style={{
                  background: c,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                }}
              />

              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="g3">

        <div className="mc">
          <div className="lbl">Corridor throughput</div>
          <div className="val">
            {throughput}
            <span className="small-muted">/hr</span>
          </div>
        </div>

        <div className="mc">
          <div className="lbl">Avg corridor delay</div>
          <div className="val">
            {delay}
            <span className="small-muted"> min</span>
          </div>
        </div>

        <div className="mc">
          <div className="lbl">Green wave synced</div>
          <div className="val">
            {synced}
            <span className="small-muted">/9</span>
          </div>
        </div>

      </div>

      {/* AI ROUTES */}
      <div className="card" style={{ marginTop: 12 }}>

        <div className="ct">
          <i className="ti ti-route" />
          AI route suggestions
        </div>

        {suggestions.length === 0 && (
          <div style={{ color: 'var(--text2)' }}>
            No active AI suggestions
          </div>
        )}

        {suggestions.map((s, i) => {

          const cls =
            s.type === 'divert'
              ? 'teal-bg'
              : s.type === 'sync'
              ? 'blue-bg'
              : 'amber-bg'

          const icol =
            s.type === 'divert'
              ? 'teal'
              : s.type === 'sync'
              ? 'blue'
              : 'amber'

          return (
            <div className="alert-item" key={i}>

              <div className={`ai-icon ${cls}`}>
                <i className={`ti ti-arrow-right ${icol}`} />
              </div>

              <div>
                <div className="at">
                  {s.description}
                </div>

                <div className="atm">
                  AI confidence: {s.confidence}% · {s.active ? 'Active' : 'Pending'}
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </>
  )
}