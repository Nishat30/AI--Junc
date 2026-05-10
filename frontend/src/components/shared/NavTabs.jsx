import React from 'react'
export default function NavTabs({ tabs, activeTab, onTab }) {
  return (
    <div className="nav-tabs">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`ntab${activeTab === t.id ? ' on' : ''}`}
          onClick={() => onTab(t.id)}
        >
          <i className={`ti ${t.icon}`} />
          {t.label}
        </button>
      ))}
    </div>
  )
}