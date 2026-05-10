import React from 'react'
import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'

const CAM_COLORS = ['#378ADD', '#EF9F27', '#1D9E75', '#E24B4A']
const CAM_IDS    = ['c1', 'c2', 'c3', 'c4']
const CAM_LABELS = ['CAM-01 · North', 'CAM-02 · East', 'CAM-03 · South', 'CAM-04 · West']
const BADGE_CLS  = ['bg', 'ba', 'bg', 'br']

function drawCamera(canvas, frameData, colorIdx) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, W, H)

  // grid lines
  ctx.strokeStyle = '#333'; ctx.lineWidth = 0.5
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
  for (let y = 0; y < H; y += 35) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

  const col = CAM_COLORS[colorIdx]
  const dets = frameData?.detections ?? []

  dets.forEach(d => {
    const x = d.bbox_x * W, y = d.bbox_y * H
    const w = d.bbox_w * W, h = d.bbox_h * H
    const fillColor = d.type === 'truck' ? '#EF9F27' : d.type === 'bike' ? '#7F77DD' : d.type === 'emergency' ? '#E24B4A' : '#378ADD'
    ctx.fillStyle = fillColor + '55'
    ctx.fillRect(x, y, w, h)
    ctx.strokeStyle = fillColor; ctx.lineWidth = 1.5
    ctx.strokeRect(x, y, w, h)
    ctx.fillStyle = fillColor; ctx.font = '8px monospace'
    ctx.fillText(`${d.type} ${Math.round(d.confidence * 100)}%`, x, y > 10 ? y - 2 : y + h + 10)
  })

  // header bar
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 0, W, 16)
  ctx.fillStyle = col; ctx.font = '9px monospace'
  ctx.fillText(`${CAM_LABELS[colorIdx]} · ${Math.round(frameData?.density ?? 0)}%`, 4, 11)
  ctx.fillStyle = '#1D9E75'; ctx.fillRect(W - 36, 2, 34, 12)
  ctx.fillStyle = 'white'; ctx.font = '8px monospace'; ctx.fillText('LIVE', W - 31, 11)
}

function CamFeed({ index, frame }) {
  const ref = useRef(null)
  useEffect(() => { drawCamera(ref.current, frame, index) }, [frame, index])

  return (
    <div className="cam-feed">
      <div className="cam-header">
        <span>{CAM_LABELS[index]}</span>
        <span className={`badge ${BADGE_CLS[index]}`}>Live</span>
      </div>
      <div className="cam-canvas-wrap">
        <canvas ref={ref} id={CAM_IDS[index]} width={300} height={140} />
      </div>
    </div>
  )
}

export default function CameraPane() {
  const detections = useStore(s => s.detections)
  const frames = detections?.frames ?? []

  const cars  = detections?.cars  ?? 0
  const trucks = detections?.trucks ?? 0
  const bikes  = detections?.bikes  ?? 0
  const emerg  = detections?.emergency ?? 0

  const ylogEntries = frames.flatMap(f =>
    f.detections.slice(0, 2).map(d =>
      `[${f.camera_id}] ${d.type} conf=${d.confidence} @ (${Math.round(d.bbox_x * 100)},${Math.round(d.bbox_y * 100)})`
    )
  ).slice(0, 5)

  return (
    <>
      <div className="cam-grid">
        {[0, 1, 2, 3].map(i => (
          <CamFeed key={i} index={i} frame={frames[i] ?? null} />
        ))}
      </div>

      <div className="g2">
        <div className="card">
          <div className="ct"><i className="ti ti-scan" /> YOLO detection feed</div>
          <div className="yolo-log">
            <div className="yolo-entry">[YOLO v8] Model loaded · 94.2% mAP</div>
            {ylogEntries.length ? ylogEntries.map((e, i) => (
              <div className="yolo-entry" key={i}>{e}</div>
            )) : <div className="yolo-entry" style={{ color: 'var(--text3)' }}>Waiting for frames…</div>}
          </div>
        </div>
        <div className="card">
          <div className="ct"><i className="ti ti-chart-bar" /> Object counts (live)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div className="mc"><div className="lbl">Cars</div><div className="val">{cars}</div></div>
            <div className="mc"><div className="lbl">Trucks</div><div className="val">{trucks}</div></div>
            <div className="mc"><div className="lbl">Bikes</div><div className="val">{bikes}</div></div>
            <div className="mc"><div className="lbl">Emergency</div><div className="val" style={{ color: 'var(--r)' }}>{emerg}</div></div>
          </div>
        </div>
      </div>
    </>
  )
}