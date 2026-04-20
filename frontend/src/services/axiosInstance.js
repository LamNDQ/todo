import axios from 'axios'
import { store } from '../redux/store'
import { setTokens, clearAuth } from '../redux/authSlice'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

// Attach access token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// On 401 — try refresh, retry once, else logout
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error)
        else prom.resolve(token)
    })
    failedQueue = []
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return axiosInstance(originalRequest)
                    })
                    .catch((err) => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            const { refreshToken } = store.getState().auth

            if (!refreshToken) {
                store.dispatch(clearAuth())
                return Promise.reject(error)
            }

            try {
                const { data } = await axios.post('/api/auth/refresh', { refreshToken })
                store.dispatch(setTokens(data))
                processQueue(null, data.accessToken)
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                store.dispatch(clearAuth())
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance
