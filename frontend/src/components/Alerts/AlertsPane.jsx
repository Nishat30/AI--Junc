import React from 'react'
import { useEffect, useState } from 'react'
import useStore from '../store/useStore'

const ALERT_TYPES = [
  'Congestion warning',
  'Emergency vehicle alert',
  'Route diversion',
  'Event traffic advisory',
  'Incident clearance',
]

const ALERT_ZONES = [
  'All commuters — JN-04 corridor',
  'North approach only',
  'East approach only',
  'MG Road corridor (all junctions)',
]

const TYPE_ICON  = { 'Congestion warning': 'alert-triangle', 'Emergency vehicle alert': 'ambulance', 'Route diversion': 'route', 'Event traffic advisory': 'calendar-event', 'Incident clearance': 'check' }
const TYPE_COLOR = { 'Congestion warning': '#E24B4A', 'Emergency vehicle alert': '#E24B4A', 'Route diversion': '#378ADD', 'Event traffic advisory': '#EF9F27', 'Incident clearance': '#1D9E75' }
const TYPE_LIGHT = { 'Congestion warning': '#FCEBEB', 'Emergency vehicle alert': '#FCEBEB', 'Route diversion': '#E6F1FB', 'Event traffic advisory': '#FAEEDA', 'Incident clearance': '#E1F5EE' }

function PhoneMockup({ notifications }) {
  return (
    <div className="phone-wrap">
      <div className="phone-frame">
        <div className="phone-status">
          <span>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          <span>Bengaluru · 84%</span>
        </div>
        <div className="phone-notif">
          <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 8, fontWeight: 500 }}>Notifications</div>
          {notifications.slice(0, 4).map((n, i) => (
            <div className="push-notif" key={i}>
              <div className="push-header">
                <div className="push-app-dot" style={{ background: TYPE_COLOR[n.alert_type] ?? '#378ADD' }} />
                <span className="push-app">Junction AI</span>
                <span className="push-time">{n.timestamp}</span>
              </div>
              <div className="push-title">{n.alert_type}</div>
              <div className="push-body">{n.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AlertsPane() {
  const alertsData  = useStore(s => s.alertsData)
  const fetchAlerts = useStore(s => s.fetchAlerts)
  const sendAlert   = useStore(s => s.sendAlert)

  const [type, setType] = useState(ALERT_TYPES[0])
  const [zone, setZone] = useState(ALERT_ZONES[0])
  const [msg,  setMsg]  = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => { fetchAlerts() }, [])

  const sent = alertsData?.sent ?? []

  async function handleSend() {
    setSending(true)
    await sendAlert({ alert_type: type, zone, message: msg || undefined })
    setMsg('')
    setSending(false)
  }

  return (
    <div className="g2">
      <div>
        <div className="card mb12">
          <div className="ct"><i className="ti ti-send" /> Send commuter alert</div>
          <div className="alert-form">
            <select value={type} onChange={e => setType(e.target.value)}>
              {ALERT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={zone} onChange={e => setZone(e.target.value)}>
              {ALERT_ZONES.map(z => <option key={z}>{z}</option>)}
            </select>
            <input
              type="text"
              placeholder="Custom message (optional)"
              value={msg}
              onChange={e => setMsg(e.target.value)}
            />
            <button className="btn-primary" onClick={handleSend} disabled={sending}>
              <i className="ti ti-send" />
              {sending ? 'Sending…' : 'Send alert to commuters'}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="ct"><i className="ti ti-history" /> Alert history</div>
          {sent.map((a, i) => (
            <div className={`notif-item${i === 0 ? ' unread' : ''}`} key={a.id}>
              <div className="notif-icon" style={{ background: TYPE_LIGHT[a.alert_type] ?? '#E6F1FB' }}>
                <i className={`ti ti-${TYPE_ICON[a.alert_type] ?? 'bell'}`} style={{ fontSize: 15, color: TYPE_COLOR[a.alert_type] ?? '#378ADD' }} />
              </div>
              <div>
                <div className="notif-title">{a.alert_type}</div>
                <div className="notif-sub">{a.zone} · {a.recipient_count?.toLocaleString()} commuters · {a.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PhoneMockup notifications={sent} />
    </div>
  )
}