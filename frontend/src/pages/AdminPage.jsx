import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import '../styles/AdminPage.css'

function AdminPage() {
    const { accessToken } = useSelector((s) => s.auth)
    const headers = { Authorization: `Bearer ${accessToken}` }

    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const load = async () => {
        try {
            const [s, u] = await Promise.all([
                axios.get('/api/admin/stats', { headers }),
                axios.get('/api/admin/users', { headers }),
            ])
            setStats(s.data)
            setUsers(u.data)
        } catch {
            toast.error('Failed to load admin data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const handleToggleStatus = async (id) => {
        try {
            const res = await axios.patch(`/api/admin/users/${id}/status`, {}, { headers })
            toast.success(res.data.message)
            load()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error')
        }
    }

    const handleChangeRole = async (id, role) => {
        try {
            await axios.patch(`/api/admin/users/${id}/role`, { role }, { headers })
            toast.success('Role updated')
            load()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this user and all their tasks?')) return
        try {
            await axios.delete(`/api/admin/users/${id}`, { headers })
            toast.success('User deleted')
            load()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error')
        }
    }

    if (loading) return <div className="page-wrapper"><p style={{ color: 'var(--text-2)' }}>Loading...</p></div>

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <span className="page-icon">⚙</span>
                <div>
                    <h1 className="page-title">Admin Panel</h1>
                    <p className="page-subtitle">Manage users and view stats.</p>
                </div>
            </div>

            {/* Stats */}
            {stats && (
                <div className="admin-stats">
                    {[
                        { label: 'Users', value: stats.totalUsers },
                        { label: 'Admins', value: stats.adminCount },
                        { label: 'Tasks', value: stats.totalTasks },
                        { label: 'Active', value: stats.activeTasks },
                        { label: 'Done', value: stats.completedTasks },
                    ].map(({ label, value }) => (
                        <div key={label} className="admin-stat-card">
                            <span className="stat-num">{value}</span>
                            <span className="stat-label">{label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Users table */}
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td>
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleChangeRole(u._id, e.target.value)}
                                        className="role-select"
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </td>
                                <td>
                                    <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                                        {u.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="action-cell">
                                    <button
                                        className="tbl-btn toggle"
                                        onClick={() => handleToggleStatus(u._id)}
                                    >
                                        {u.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        className="tbl-btn delete"
                                        onClick={() => handleDelete(u._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminPage
