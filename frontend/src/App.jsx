import { useEffect } from 'react'
import React from 'react'
import useStore from './components/store/useStore'
import TopBar from './components/shared/TopBar'
import MetricsBar from './components/shared/MetricsBar'
import NavTabs from './components/shared/NavTabs'
import JunctionPane from './components/Junction/JunctionPane'
import CameraPane from './components/Camera/CameraPane'
import CorridorPane from './components/Corridor/CorridorPane'
import WeatherPane from './components/Weather/WeatherPane'
import AlertsPane from './components/Alerts/AlertsPane'
import SettingsPane from './components/Settings/SettingsPane'

const TABS = [
  { id: 'main',     label: 'Junction',        icon: 'ti-traffic-lights' },
  { id: 'camera',   label: 'Camera / YOLO',   icon: 'ti-camera' },
  { id: 'corridor', label: 'Corridor map',     icon: 'ti-map-2' },
  { id: 'weather',  label: 'Weather & events', icon: 'ti-cloud-rain' },
  { id: 'alerts',   label: 'Commuter alerts',  icon: 'ti-device-mobile' },
  { id: 'settings', label: 'Settings',         icon: 'ti-settings' },
]

export default function App() {
  const { activeTab, setTab, connectWS, fetchSettings } = useStore()

  useEffect(() => {
    connectWS()
    fetchSettings()
  }, [])

  return (
    <div className="dashboard">
      <TopBar />
      <MetricsBar />
      <NavTabs tabs={TABS} activeTab={activeTab} onTab={setTab} />

      <div className={`pane ${activeTab === 'main'     ? 'on' : ''}`}><JunctionPane /></div>
      <div className={`pane ${activeTab === 'camera'   ? 'on' : ''}`}><CameraPane /></div>
      <div className={`pane ${activeTab === 'corridor' ? 'on' : ''}`}><CorridorPane /></div>
      <div className={`pane ${activeTab === 'weather'  ? 'on' : ''}`}><WeatherPane /></div>
      <div className={`pane ${activeTab === 'alerts'   ? 'on' : ''}`}><AlertsPane /></div>
      <div className={`pane ${activeTab === 'settings' ? 'on' : ''}`}><SettingsPane /></div>
    </div>
  )
}