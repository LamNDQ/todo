import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { register as registerUser, clearError } from '../redux/authSlice'
import '../styles/Auth.css'

const schema = z.object({
    username: z
        .string()
        .min(3, 'At least 3 characters')
        .max(30, 'Max 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and _ only'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'At least 6 characters'),
})

function RegisterPage() {
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
        const result = await dispatch(registerUser(data))
        if (registerUser.fulfilled.match(result)) {
            toast.success('Account created! 🎉')
            navigate('/todo')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Header */}
                <div className="auth-header">
                    <div className="auth-logo">◈</div>
                    <h1 className="auth-title">Create account</h1>
                    <p className="auth-subtitle">Join Workspace and get started</p>
                </div>

                {/* Error */}
                {error && <div className="auth-error">{error}</div>}

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>

                    {/* Username */}
                    <div className="auth-field">
                        <label htmlFor="username">Username</label>
                        <div className="input-wrap">
                            <span className="input-icon">◎</span>
                            <input
                                id="username"
                                type="text"
                                placeholder="your_username"
                                autoComplete="username"
                                {...register('username')}
                            />
                        </div>
                        {errors.username && <span className="field-error">{errors.username.message}</span>}
                    </div>

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
                                placeholder="Min 6 characters"
                                autoComplete="new-password"
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
                        {loading ? <span className="btn-spinner" /> : 'Create Account →'}
                    </button>
                </form>

                {/* Switch */}
                <p className="auth-switch">
                    Already have an account?&nbsp;<Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage
