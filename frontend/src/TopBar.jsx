import { useEffect, useState } from 'react'
import useStore from '../../store/useStore'

export default function TopBar() {
  const connected = useStore(s => s.connected)
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="topbar">
      <div>
        <h1>
          <i className="ti ti-traffic-lights" />
          Junction AI v2 — Full System
        </h1>
        <div className="sub">MG Road × Brigade Road · JN-04 · Bengaluru Corridor Network</div>
      </div>
      <div className="topbar-right">
        <div className="live-badge">
          <div className="live-dot" style={{ background: connected ? 'var(--t)' : 'var(--r)' }} />
          {connected ? 'Live' : 'Reconnecting…'}
        </div>
        <span className="clock">{time}</span>
      </div>
    </div>
  )
}