import React, { useState } from 'react'
import { fetchWeather } from '../services/weatherService'
import SearchInput from '../components/SearchInput'
import '../styles/WeatherPage.css'

const getWeatherEmoji = (code) => {
    if (code >= 200 && code < 300) return '⛈️'
    if (code >= 300 && code < 400) return '🌦️'
    if (code >= 500 && code < 600) return '🌧️'
    if (code >= 600 && code < 700) return '❄️'
    if (code >= 700 && code < 800) return '🌫️'
    if (code === 800) return '☀️'
    if (code > 800) return '⛅'
    return '🌡️'
}

function WeatherPage() {
    const [city, setCity] = useState('')
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSearch = async () => {
        const trimmed = city.trim()
        if (!trimmed) return
        setLoading(true)
        setError('')
        setWeather(null)
        try {
            const data = await fetchWeather(trimmed)
            setWeather(data)
        } catch (err) {
            if (err.response?.status === 404) {
                setError(`City "${trimmed}" not found. Please try another.`)
            } else if (err.response?.status === 401) {
                setError('Invalid API key. Please set VITE_WEATHER_API_KEY in frontend/.env')
            } else {
                setError('Failed to fetch weather. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-wrapper">
            <div className="weather-blob blob-1" />
            <div className="weather-blob blob-2" />

            <div className="page-header">
                <span className="page-icon">◈</span>
                <div>
                    <h1 className="page-title">Weather App</h1>
                </div>
            </div>

            <SearchInput
                value={city}
                onChange={setCity}
                onSearch={handleSearch}
                placeholder="Enter city name... (e.g. Da Nang)"
                loading={loading}
            />

            {error && <div className="error-card">{error}</div>}

            {weather && (
                <div className="weather-card">
                    <div className="weather-location">
                        <span className="location-pin">📍</span>
                        {weather.name}, {weather.sys.country}
                    </div>
                    <div className="weather-main">
                        <span className="weather-emoji">{getWeatherEmoji(weather.weather[0].id)}</span>
                        <div className="temp-block">
                            <span className="temperature">{Math.round(weather.main.temp)}°C</span>
                            <span className="feels-like">Feels like {Math.round(weather.main.feels_like)}°C</span>
                        </div>
                    </div>
                    <div className="weather-condition">{weather.weather[0].description}</div>
                    <div className="weather-details">
                        <div className="detail-item">
                            <span className="detail-icon">💧</span>
                            <span className="detail-val">{weather.main.humidity}%</span>
                            <span className="detail-label">Humidity</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">💨</span>
                            <span className="detail-val">{weather.wind.speed} m/s</span>
                            <span className="detail-label">Wind</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">👁️</span>
                            <span className="detail-val">{(weather.visibility / 1000).toFixed(1)} km</span>
                            <span className="detail-label">Visibility</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-icon">🌡️</span>
                            <span className="detail-val">
                                {Math.round(weather.main.temp_max)}° / {Math.round(weather.main.temp_min)}°
                            </span>
                            <span className="detail-label">H / L</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WeatherPage
