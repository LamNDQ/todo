import React from 'react'
import '../styles/Button.css'

function Button({ children, onClick, variant = 'primary', title, disabled, className = '' }) {
    return (
        <button
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
            title={title}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button
