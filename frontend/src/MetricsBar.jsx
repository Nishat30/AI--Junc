import useStore from '../../store/useStore'

export default function MetricsBar() {
  const junction    = useStore(s => s.junction)
  const detections  = useStore(s => s.detections)
  const alertsTotal = useStore(s => s.alertsData?.total_sent ?? 14)

  const vpm   = junction?.vehicles_per_min ?? '—'
  const awt   = junction?.avg_wait_seconds  ? junction.avg_wait_seconds + 's' : '—'
  const dets  = detections?.total ?? 0
  const online = 8

  return (
    <div className="metrics">
      <div className="mc">
        <div className="lbl">Vehicles / min</div>
        <div className="val">{vpm}</div>
        <div className="sub2 red"><i className="ti ti-trending-up" /> +18 vs avg</div>
      </div>
      <div className="mc">
        <div className="lbl">Avg wait</div>
        <div className="val">{awt}</div>
        <div className="sub2 teal"><i className="ti ti-trending-down" /> −8s vs fixed</div>
      </div>
      <div className="mc">
        <div className="lbl">Efficiency</div>
        <div className="val">31%</div>
        <div className="sub2 teal">vs. fixed timer</div>
      </div>
      <div className="mc">
        <div className="lbl">Detections</div>
        <div className="val">{dets}</div>
        <div className="sub2 muted">YOLO objects</div>
      </div>
      <div className="mc">
        <div className="lbl">Junctions online</div>
        <div className="val">{online}<span className="small-muted">/9</span></div>
        <div className="sub2 muted">corridor active</div>
      </div>
      <div className="mc">
        <div className="lbl">Alerts sent</div>
        <div className="val">{alertsTotal}</div>
        <div className="sub2 muted">to commuters</div>
      </div>
    </div>
  )
}