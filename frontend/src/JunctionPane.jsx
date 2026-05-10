import useStore from '../../store/useStore'
import JunctionSVG from '../JunctionSVG'
import PredictionsCard from './PredictionsCard'
import VolumeChart from './VolumeChart'
import EventLog from './EventLog'
import LaneDensityTable from './LaneDensityTable'

export default function JunctionPane() {
  const junction    = useStore(s => s.junction)
  const triggerEmergency = useStore(s => s.triggerEmergency)

  const emergency = junction?.emergency_active ?? false
  const countdown = junction?.signal?.countdown ?? '--'
  const phase     = junction?.signal?.phase     ?? 'NS_GREEN'
  const progress  = junction?.signal?.phase_progress ?? 0
  const aiMode    = junction?.signal?.ai_mode   ?? 'Adaptive'

  const phaseLabel = phase === 'NS_GREEN' ? 'N–S Green' : phase === 'EW_GREEN' ? 'E–W Green' : 'All Red'
  const phaseColor = phase === 'NS_GREEN' ? 'var(--t)' : phase === 'EW_GREEN' ? 'var(--a)' : 'var(--r)'

  return (
    <>
      <div className="g2">
        {/* Left: junction visual */}
        <div className="card">
          <div className="ct"><i className="ti ti-traffic-lights" /> Live junction</div>
          <div className="junction-wrap">
            <JunctionSVG junction={junction} />
            <div className="phase-row">
              <div className="phase-col">
                <div className="lbl-sm">Phase</div>
                <div className="phase-label">{phaseLabel}</div>
                <div className="phase-bar">
                  <div className="phase-fill" style={{ background: phaseColor, width: `${progress}%` }} />
                </div>
              </div>
              <div className="phase-col">
                <div className="lbl-sm">Countdown</div>
                <div className="countdown">{emergency ? junction?.emergency_countdown + 's' : countdown + 's'}</div>
              </div>
              <div className="phase-col">
                <div className="lbl-sm">AI mode</div>
                <span className={`badge ${aiMode === 'Adaptive' ? 'bg' : 'ba'}`}>{aiMode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: emergency + predictions */}
        <div className="col-stack">
          <div className="card">
            <div className="ct"><i className="ti ti-ambulance" /> Emergency corridor</div>
            <div className={`emer-panel${emergency ? ' act' : ''}`}>
              <div className="ei"><i className="ti ti-ambulance" /></div>
              <div>
                <div className="et">{emergency ? 'EMERGENCY — Ambulance detected!' : 'No active emergency'}</div>
                <div className="es">
                  {emergency
                    ? `All-red phase · Clearing in ${junction?.emergency_countdown}s`
                    : 'All lanes operating normally'}
                </div>
              </div>
            </div>
            <button className="btn-outline" onClick={triggerEmergency}>
              <i className="ti ti-player-play" /> Simulate emergency
            </button>
          </div>
          <PredictionsCard />
        </div>
      </div>

      <div className="card mb12">
        <div className="ct"><i className="ti ti-chart-line" /> Traffic volume — last 14 cycles</div>
        <div className="chart-wrap">
          <VolumeChart />
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="ct"><i className="ti ti-bell" /> Event log</div>
          <EventLog />
        </div>
        <div className="card">
          <div className="ct"><i className="ti ti-arrows-split-2" /> Lane density</div>
          <LaneDensityTable />
        </div>
      </div>
    </>
  )
}