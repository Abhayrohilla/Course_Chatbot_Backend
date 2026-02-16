import { useState, useEffect } from 'react';
import './SuggestionChips.css';

function SuggestionChips({ onSelectSuggestion, visible }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch suggestions from API
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await fetch('/api/suggestions');
                const data = await response.json();
                setSuggestions(data.suggestions || []);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        if (visible) {
            fetchSuggestions();
        }
    }, [visible]);

    if (!visible || loading) return null;
    if (suggestions.length === 0) return null;

    return (
        <div className="suggestion-chips-container">
            <p className="chips-label">Try searching for:</p>
            <div className="chips-wrapper">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        className="suggestion-chip"
                        onClick={() => onSelectSuggestion(suggestion)}
                    >
                        <span className="chip-text">{suggestion}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SuggestionChips;
