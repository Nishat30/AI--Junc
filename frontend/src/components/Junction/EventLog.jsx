import React from 'react'
export default function EventLog() {
  const logs = [
    'Ambulance detected at North lane',
    'Signal switched to ALL_RED',
    'Traffic normalized',
    'AI updated signal timing'
  ]

  return (
    <div className="event-log">
      {logs.map((log, i) => (
        <div key={i} className="event-item">
          {log}
        </div>
      ))}
    </div>
  )
}