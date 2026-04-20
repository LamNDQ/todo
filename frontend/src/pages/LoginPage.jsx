import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, clearError } from '../redux/authSlice'
import '../styles/Auth.css'

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, accessToken } = useSelector((s) => s.auth)
    const [showPw, setShowPw] = useState(false)

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
            toast.success('Welcome back! 👋')
            navigate('/todo')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Header */}
                <div className="auth-header">
                    <div className="auth-logo">✦</div>
                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-subtitle">Sign in to your Workspace account</p>
                </div>

                {/* Error */}
                {error && <div className="auth-error">{error}</div>}

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>

                    {/* Email */}
                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <div className="input-wrap">
                            <span className="input-icon">✉</span>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                {...register('email')}
                            />
                        </div>
                        {errors.email && <span className="field-error">{errors.email.message}</span>}
                    </div>

                    {/* Password */}
                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrap">
                            <span className="input-icon">🔒</span>
                            <input
                                id="password"
                                type={showPw ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                {...register('password')}
                            />
                            <button
                                type="button"
                                className="pw-toggle"
                                onClick={() => setShowPw((v) => !v)}
                                tabIndex={-1}
                                aria-label={showPw ? 'Hide password' : 'Show password'}
                            >
                                {showPw ? '🙈' : '👁'}
                            </button>
                        </div>
                        {errors.password && <span className="field-error">{errors.password.message}</span>}
                    </div>

                    {/* Submit */}
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? <span className="btn-spinner" /> : 'Sign In →'}
                    </button>
                </form>

                {/* Switch */}
                <p className="auth-switch">
                    Don't have an account?&nbsp;<Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
