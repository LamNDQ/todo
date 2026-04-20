import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function ProtectedRoute({ children }) {
    const { accessToken, initialized } = useSelector((s) => s.auth)

    if (!initialized && accessToken) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-2)' }}>
                Loading...
            </div>
        )
    }

    if (!accessToken) return <Navigate to="/login" replace />
    return children
}

export function AdminRoute({ children }) {
    const { user } = useSelector((s) => s.auth)
    if (!user || user.role !== 'admin') return <Navigate to="/todo" replace />
    return children
}
