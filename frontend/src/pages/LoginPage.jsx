import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, clearError } from '../redux/authSlice'
import '../styles/AuthPage.css'

const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password required'),
})

function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, accessToken } = useSelector((s) => s.auth)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    })

    useEffect(() => {
        if (accessToken) navigate('/todo', { replace: true })
        return () => dispatch(clearError())
    }, [accessToken])

    const onSubmit = async (data) => {
        const result = await dispatch(login(data))
        if (login.fulfilled.match(result)) {
            toast.success('Welcome back!')
            navigate('/todo')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-icon">✦</span>
                    <h1 className="auth-title">Sign In</h1>
                    <p className="auth-subtitle">Welcome back to Workspace</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="field">
                        <label>Email</label>
                        <input type="email" placeholder="you@example.com" {...register('email')} />
                        {errors.email && <span className="field-error">{errors.email.message}</span>}
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" {...register('password')} />
                        {errors.password && <span className="field-error">{errors.password.message}</span>}
                    </div>
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? <span className="spinner" /> : 'Sign In'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
