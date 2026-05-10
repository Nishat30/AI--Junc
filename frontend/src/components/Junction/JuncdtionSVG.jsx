import React from 'react'
export default function JunctionSVG({ junction }) {
  const phase = junction?.signal?.phase ?? 'NS_GREEN'
  const lanes = junction?.lanes ?? []

  const nsGreen = phase === 'NS_GREEN'
  const allRed  = phase === 'ALL_RED'

  const snR = allRed ? '#E24B4A' : nsGreen ? '#441'    : '#E24B4A'
  const snG = allRed ? '#141'    : nsGreen ? '#1D9E75' : '#141'
  const seR = allRed ? '#E24B4A' : nsGreen ? '#E24B4A' : '#441'
  const seG = allRed ? '#141'    : nsGreen ? '#141'    : '#1D9E75'

  const dn = lanes.find(l => l.direction === 'north')?.density ?? 72
  const ds = lanes.find(l => l.direction === 'south')?.density ?? 45
  const de = lanes.find(l => l.direction === 'east' )?.density ?? 88
  const dw = lanes.find(l => l.direction === 'west' )?.density ?? 60

  return (
    <svg id="jsvg" viewBox="0 0 300 300" className="junction-svg">
      <rect width="300" height="300" fill="#2a2a2a"/>
      <rect x="0" y="110" width="300" height="80" fill="#444"/>
      <rect x="110" y="0" width="80" height="300" fill="#444"/>
      <rect x="110" y="110" width="80" height="80" fill="#555"/>
      <line x1="0" y1="150" x2="105" y2="150" stroke="#888" strokeWidth="1.5" strokeDasharray="14,10"/>
      <line x1="195" y1="150" x2="300" y2="150" stroke="#888" strokeWidth="1.5" strokeDasharray="14,10"/>
      <line x1="150" y1="0" x2="150" y2="105" stroke="#888" strokeWidth="1.5" strokeDasharray="14,10"/>
      <line x1="150" y1="195" x2="150" y2="300" stroke="#888" strokeWidth="1.5" strokeDasharray="14,10"/>

      {/* density overlays */}
      <rect x="120" y="10" width="20" height="95" rx="2" fill="#378ADD" opacity={dn/200}/>
      <rect x="160" y="195" width="20" height="95" rx="2" fill="#1D9E75" opacity={ds/200}/>
      <rect x="195" y="120" width="95" height="20" rx="2" fill="#EF9F27" opacity={de/200}/>
      <rect x="10" y="160" width="95" height="20" rx="2" fill="#E24B4A" opacity={dw/200}/>

      {/* density labels */}
      <text x="130" y="70" fill="#89c4f0" fontSize="9" fontFamily="sans-serif">{Math.round(dn)}%</text>
      <text x="170" y="245" fill="#5dcaa5" fontSize="9" fontFamily="sans-serif">{Math.round(ds)}%</text>
      <text x="242" y="136" fill="#FAC775" fontSize="9" fontFamily="sans-serif">{Math.round(de)}%</text>
      <text x="18"  y="176" fill="#f09595" fontSize="9" fontFamily="sans-serif">{Math.round(dw)}%</text>

      {/* North signal */}
      <g transform="translate(90,82)">
        <rect width="14" height="36" rx="3" fill="#111" stroke="#333" strokeWidth=".5"/>
        <circle cx="7" cy="8"  r="4" fill={snR}/>
        <circle cx="7" cy="28" r="4" fill={snG}/>
      </g>
      {/* South signal */}
      <g transform="translate(196,182)">
        <rect width="14" height="36" rx="3" fill="#111" stroke="#333" strokeWidth=".5"/>
        <circle cx="7" cy="8"  r="4" fill={snR}/>
        <circle cx="7" cy="28" r="4" fill={snG}/>
      </g>
      {/* East signal */}
      <g transform="translate(218,90)">
        <rect width="36" height="14" rx="3" fill="#111" stroke="#333" strokeWidth=".5"/>
        <circle cx="8"  cy="7" r="4" fill={seR}/>
        <circle cx="28" cy="7" r="4" fill={seG}/>
      </g>
      {/* West signal */}
      <g transform="translate(46,196)">
        <rect width="36" height="14" rx="3" fill="#111" stroke="#333" strokeWidth=".5"/>
        <circle cx="8"  cy="7" r="4" fill={seR}/>
        <circle cx="28" cy="7" r="4" fill={seG}/>
      </g>

      <text x="150" y="18"  textAnchor="middle" fill="#aaa" fontSize="9" fontFamily="sans-serif">N</text>
      <text x="150" y="295" textAnchor="middle" fill="#aaa" fontSize="9" fontFamily="sans-serif">S</text>
      <text x="8"   y="153" fill="#aaa" fontSize="9" fontFamily="sans-serif">W</text>
      <text x="284" y="153" fill="#aaa" fontSize="9" fontFamily="sans-serif">E</text>
    </svg>
  )
}