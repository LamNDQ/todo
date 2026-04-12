import React from 'react'
import '../styles/SearchInput.css'

function SearchInput({ value, onChange, onSearch, placeholder, loading }) {
    return (
        <div className="search-input-row">
            <input
                className="search-input"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                placeholder={placeholder}
            />
            <button className="search-btn" onClick={onSearch} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Search'}
            </button>
        </div>
    )
}

export default SearchInput
