import React, { useState } from 'react'
import { searchWikipedia } from '../services/wikipediaService'
import SearchInput from '../components/SearchInput'
import '../styles/WikipediaPage.css'

const stripHtml = (html) => html.replace(/<[^>]*>/g, '')

function WikipediaPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [searched, setSearched] = useState(false)

    const handleSearch = async () => {
        const trimmed = query.trim()
        if (!trimmed) return
        setLoading(true)
        setError('')
        setResults([])
        setSearched(false)
        try {
            const data = await searchWikipedia(trimmed)
            setResults(data)
            setSearched(true)
        } catch {
            setError('Failed to fetch Wikipedia results. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const getWikiUrl = (title) =>
        `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <span className="page-icon">◉</span>
                <div>
                    <h1 className="page-title">Wikipedia Search</h1>
                </div>
            </div>

            <SearchInput
                value={query}
                onChange={setQuery}
                onSearch={handleSearch}
                placeholder="Search Wikipedia... (e.g. Artificial Intelligence)"
                loading={loading}
            />

            {error && <div className="error-card">{error}</div>}

            {searched && results.length === 0 && !error && (
                <div className="empty-state">
                    <span className="empty-icon">🔍</span>
                    <p>No results found for "{query}"</p>
                </div>
            )}

            <ul className="wiki-list">
                {results.map((item, idx) => (
                    <li key={item.pageid} className="wiki-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <a href={getWikiUrl(item.title)} target="_blank" rel="noreferrer" className="wiki-link">
                            <div className="wiki-index">{idx + 1}</div>
                            <div className="wiki-content">
                                <h3 className="wiki-title">{item.title}</h3>
                                <p className="wiki-snippet">{stripHtml(item.snippet)}...</p>
                            </div>
                            <span className="wiki-arrow">↗</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default WikipediaPage
