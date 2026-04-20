import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { logout } from '../redux/authSlice'
import '../styles/Sidebar.css'

const NAV_ITEMS = [
    { path: '/todo', label: 'Todo App', icon: '✦' },
    { path: '/weather', label: 'Weather App', icon: '◈' },
    { path: '/wikipedia', label: 'Wikipedia Search', icon: '◉' },
]

function Sidebar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((s) => s.auth)
    const [busy, setBusy] = useState(false)

    const handleLogout = async () => {
        setBusy(true)
        await dispatch(logout())
        toast.info('Logged out successfully')
        navigate('/login')
    }

    return (
        <aside className="sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <span className="brand-dot" />
                <span className="brand-name">Workspace</span>
            </div>

            {/* Nav links */}
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

                {user?.role === 'admin' && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                    >
                        <span className="nav-icon">⚙</span>
                        <span className="nav-label">Admin</span>
                        <span className="nav-arrow">›</span>
                    </NavLink>
                )}
            </nav>

            {/* Footer: user info + logout */}
            <div className="sidebar-footer">
                {/* Avatar + name + role */}
                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user?.username?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="user-meta">
                        <span className="user-name">{user?.username}</span>
                        <span className="user-role">{user?.role}</span>
                    </div>
                </div>

                {/* Logout button */}
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    disabled={busy}
                    title="Sign out"
                >
                    <span className="logout-icon">→</span>
                    <span className="logout-label">Sign out</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
