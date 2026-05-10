import { useEffect, useState } from 'react'
import React from 'react'
import useStore from '../store/useStore'

const TOGGLES = [
  { key: 'adaptive_ai',          label: 'Adaptive AI timing' },
  { key: 'emergency_detection',  label: 'Emergency vehicle detection' },
  { key: 'congestion_prediction',label: 'Congestion prediction (ML)' },
  { key: 'yolo_detection',       label: 'YOLO camera detection' },
  { key: 'corridor_sync',        label: 'Multi-junction corridor sync' },
  { key: 'weather_adaptive',     label: 'Weather-adaptive timing' },
  { key: 'commuter_alerts',      label: 'Commuter push alerts' },
  { key: 'night_mode',           label: 'Night mode (low volume)' },
  { key: 'pedestrian_priority',  label: 'Pedestrian priority' },
]

const SLIDERS = [
  { key: 'min_green_time',      label: 'Min green time',          min: 10, max: 40,  unit: 's' },
  { key: 'max_green_time',      label: 'Max green time',          min: 30, max: 90,  unit: 's' },
  { key: 'yolo_threshold',      label: 'YOLO detection threshold',min: 40, max: 95,  unit: '%' },
  { key: 'alert_sensitivity',   label: 'Alert sensitivity',       min: 1,  max: 3,   unit: '' },
  { key: 'weather_timing_boost',label: 'Weather timing boost',    min: 0,  max: 40,  unit: '%' },
]

export default function SettingsPane() {
  const settings       = useStore(s => s.settings)
  const fetchSettings  = useStore(s => s.fetchSettings)
  const updateSettings = useStore(s => s.updateSettings)

  const [local, setLocal] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchSettings() }, [])
  useEffect(() => { if (settings && !local) setLocal({ ...settings }) }, [settings])

  if (!local) return <div style={{ padding: 20, color: 'var(--text2)' }}>Loading settings…</div>

  function toggle(key) {
    setLocal(s => ({ ...s, [key]: !s[key] }))
  }
  function slide(key, val) {
    setLocal(s => ({ ...s, [key]: Number(val) }))
  }

  async function save() {
    setSaving(true)
    await updateSettings(local)
    setSaving(false)
  }

  const senLabels = ['Low', 'Medium', 'High']

  return (
    <div className="g2">
      <div className="card">
        <div className="ct"><i className="ti ti-adjustments" /> AI & signal controls</div>
        {TOGGLES.map(t => (
          <div className="srow" key={t.key}>
            <span>{t.label}</span>
            <label className="tog">
              <input type="checkbox" checked={!!local[t.key]} onChange={() => toggle(t.key)} />
              <div className="tog-sl" />
            </label>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card">
          <div className="ct"><i className="ti ti-sliders" /> Timing parameters</div>
          {SLIDERS.map(s => (
            <div key={s.key} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 5 }}>
                {s.label}:{' '}
                <strong>
                  {s.key === 'alert_sensitivity'
                    ? senLabels[(local[s.key] ?? 2) - 1]
                    : (local[s.key] ?? 0)}{s.unit}
                </strong>
              </div>
              <input
                type="range"
                min={s.min} max={s.max} step={1}
                value={local[s.key] ?? s.min}
                onChange={e => slide(s.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={save} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
          <i className="ti ti-device-floppy" />
          {saving ? 'Saving…' : 'Save settings to backend'}
        </button>
      </div>
    </div>
  )
}