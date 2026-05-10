import { useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import useStore from '../../store/useStore'

const IMPACT_BADGE = { Low: 'badge bg', Moderate: 'badge ba', High: 'badge br', Resolved: 'badge bg' }
const IMPACT_COLOR = { Low: '#1D9E75', Medium: '#EF9F27', High: '#E24B4A', Resolved: '#639922' }
const IMPACT_FILL  = { Low: 'var(--t)', Medium: 'var(--a)', High: 'var(--r)', Resolved: 'var(--g)' }

export default function WeatherPane() {
  const weather      = useStore(s => s.weather)
  const fetchWeather = useStore(s => s.fetchWeather)

  useEffect(() => { fetchWeather() }, [])

  const conditions = weather?.conditions ?? []
  const forecast   = weather?.forecast   ?? []
  const events     = weather?.events     ?? []

  return (
    <>
      <div className="g2 mb12">
        <div className="card">
          <div className="ct"><i className="ti ti-cloud" /> Current weather impact</div>
          {conditions.map((c, i) => (
            <div className="weather-row" key={i}>
              <div className="w-icon" style={{ background: 'var(--bl)' }}>
                <i className={`ti ti-${c.icon}`} style={{ color: 'var(--b)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{c.ai_action}</div>
              </div>
              <span className={IMPACT_BADGE[c.impact] ?? 'badge ba'}>{c.impact}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="ct"><i className="ti ti-clock" /> 6-hour forecast — traffic impact</div>
          <div className="chart-wrap-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecast} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,.12)" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip
                  contentStyle={{ fontSize: 11, background: 'var(--bg)', border: '0.5px solid var(--border)', borderRadius: 6 }}
                />
                <Bar dataKey="impact" radius={[3, 3, 0, 0]}>
                  {forecast.map((f, i) => <Cell key={i} fill={f.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="ct"><i className="ti ti-calendar-event" /> Events affecting traffic today</div>
        {events.map((ev, i) => (
          <div className="event-card" key={i}>
            <div className="event-header">
              <div>
                <div className="event-title">{ev.title}</div>
                <div className="event-sub">{ev.time} · {ev.details}</div>
              </div>
              <span className={IMPACT_BADGE[ev.impact] ?? 'badge ba'}>{ev.impact}</span>
            </div>
            <div className="event-action">{ev.ai_action}</div>
            <div className="impact-bar">
              <div className="impact-fill" style={{ background: IMPACT_FILL[ev.impact] ?? 'var(--a)', width: `${ev.impact_score * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}