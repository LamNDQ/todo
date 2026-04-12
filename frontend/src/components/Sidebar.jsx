import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/Sidebar.css'

const NAV_ITEMS = [
    { path: '/todo', label: 'Todo App', icon: '✦' },
    { path: '/weather', label: 'Weather App', icon: '◈' },
    { path: '/wikipedia', label: 'Wikipedia Search', icon: '◉' },
]

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="brand-dot" />
                <span className="brand-name">Workspace</span>
            </div>
            <nav className="sidebar-nav">
                {NAV_ITEMS.map(({ path, label, icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                    >
                        <span className="nav-icon">{icon}</span>
                        <span className="nav-label">{label}</span>
                        <span className="nav-arrow">›</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar
