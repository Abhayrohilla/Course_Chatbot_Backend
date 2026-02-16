import React, { useState, useEffect } from 'react';

interface SuggestionChipsProps {
    onSelectSuggestion: (suggestion: string) => void;
    visible: boolean;
}

function SuggestionChips({ onSelectSuggestion, visible }: SuggestionChipsProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

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
        <div className="py-2 md:py-3 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Try searching for:</p>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-full text-xs md:text-sm text-slate-600 font-medium cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 hover:-translate-y-0.5 shadow-sm active:translate-y-0 active:bg-blue-100"
                        onClick={() => onSelectSuggestion(suggestion)}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SuggestionChips;
