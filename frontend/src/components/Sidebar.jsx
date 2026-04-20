import React from 'react'
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

    const handleLogout = async () => {
        await dispatch(logout())
        toast.info('Logged out')
        navigate('/login')
    }

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

            <div className="sidebar-footer">
                <div className="user-info">
                    <span className="user-avatar">{user?.username?.[0]?.toUpperCase()}</span>
                    <span className="user-name">{user?.username}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout} title="Logout">⏻</button>
            </div>
        </aside>
    )
}

export default Sidebar
