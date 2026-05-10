import React from 'react'
export default function LaneDensityTable() {
  const lanes = [
    { lane: 'North', density: '40%' },
    { lane: 'South', density: '60%' },
    { lane: 'East', density: '80%' },
    { lane: 'West', density: '35%' }
  ]

  return (
    <table className="density-table">
      <thead>
        <tr>
          <th>Lane</th>
          <th>Density</th>
        </tr>
      </thead>

      <tbody>
        {lanes.map((l, i) => (
          <tr key={i}>
            <td>{l.lane}</td>
            <td>{l.density}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}