import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { register as registerUser, clearError } from '../redux/authSlice'
import '../styles/AuthPage.css'

const schema = z.object({
    username: z.string().min(3, 'Min 3 characters').max(30),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Min 6 characters'),
})

function RegisterPage() {
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
        const result = await dispatch(registerUser(data))
        if (registerUser.fulfilled.match(result)) {
            toast.success('Account created!')
            navigate('/todo')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-icon">◈</span>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join Workspace today</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="field">
                        <label>Username</label>
                        <input type="text" placeholder="your_username" {...register('username')} />
                        {errors.username && <span className="field-error">{errors.username.message}</span>}
                    </div>
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
                        {loading ? <span className="spinner" /> : 'Create Account'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage
