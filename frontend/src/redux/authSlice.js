import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = '/api/auth'

// Persist token in localStorage
const saveToken = (token) => token
    ? localStorage.setItem('accessToken', token)
    : localStorage.removeItem('accessToken')

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || ''}/api/auth/refresh`,
            { refreshToken }
        )
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
})

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${API}/login`, data)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
})

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().auth.accessToken
        const res = await axios.get(`${API}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return res.data.user
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch user')
    }
})

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
    const { accessToken, refreshToken } = getState().auth
    try {
        await axios.post(`${API}/logout`, { refreshToken }, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
    } catch { /* ignore */ }
})

const storedToken = localStorage.getItem('accessToken')

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: storedToken || null,
        refreshToken: null,
        loading: false,
        error: null,
        initialized: false,
    },
    reducers: {
        clearError: (state) => { state.error = null },
    },
    extraReducers: (builder) => {
        // register
        builder
            .addCase(register.pending, (state) => { state.loading = true; state.error = null })
            .addCase(register.fulfilled, (state, { payload }) => {
                state.loading = false
                state.user = payload.user
                state.accessToken = payload.accessToken
                state.refreshToken = payload.refreshToken
                state.initialized = true
                saveToken(payload.accessToken)
            })
            .addCase(register.rejected, (state, { payload }) => {
                state.loading = false; state.error = payload
            })

        // login
        builder
            .addCase(login.pending, (state) => { state.loading = true; state.error = null })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loading = false
                state.user = payload.user
                state.accessToken = payload.accessToken
                state.refreshToken = payload.refreshToken
                state.initialized = true
                saveToken(payload.accessToken)
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.loading = false; state.error = payload
            })

        // fetchMe
        builder
            .addCase(fetchMe.fulfilled, (state, { payload }) => {
                state.user = payload; state.initialized = true
            })
            .addCase(fetchMe.rejected, (state) => {
                state.user = null; state.accessToken = null
                state.initialized = true
                saveToken(null)
            })

        // logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null; state.accessToken = null
            state.refreshToken = null; state.initialized = false
            saveToken(null)
        })
    },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
