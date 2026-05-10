import React from 'react'
export default function PredictionsCard() {
  return (
    <div className="card">
      <div className="ct">
        <i className="ti ti-brain" /> AI Predictions
      </div>

      <div className="pred-list">
        <div className="pred-item">
          <span>North Lane</span>
          <span className="badge bg">Low Traffic</span>
        </div>

        <div className="pred-item">
          <span>South Lane</span>
          <span className="badge ba">Medium Traffic</span>
        </div>

        <div className="pred-item">
          <span>East Lane</span>
          <span className="badge br">Heavy Traffic</span>
        </div>
      </div>
    </div>
  )
}