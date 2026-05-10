import React from 'react'
import useStore from '../store/useStore'

export default function VolumeChart() {

  const volHistory = useStore(s => s.volHistory)

  const data =
    volHistory && volHistory.length > 0
      ? volHistory
      : [20, 40, 60, 35, 70, 50, 80, 55, 65, 48, 72, 90, 58, 76]

  const maxValue = Math.max(...data)

  return (

    <div
      style={{
        width: '100%',
        height: 120,
        overflow: 'hidden',

        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',

        gap: 8,
        padding: '10px 16px 16px',
        boxSizing: 'border-box',
      }}
    >

      {data.map((v, i) => (

        <div
          key={i}
          style={{
            flex: 1,
            height: '100%',

            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >

          <div
            style={{
              width: '100%',
              maxWidth: 28,

              height: `${(v / maxValue) * 160}px`,

              borderRadius: 10,

              background:
                v > 75
                  ? '#E24B4A'
                  : v > 50
                  ? '#EF9F27'
                  : '#1D9E75',

              transition: '0.3s',
            }}
          />

          <span
            style={{
              marginTop: 8,
              fontSize: 11,
              color: '#aaa',
            }}
          >
            {i + 1}
          </span>

        </div>
      ))}

    </div>
  )
}