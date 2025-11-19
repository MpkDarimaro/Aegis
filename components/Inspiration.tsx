import React from 'react';
import { INSPIRATIONAL_QUOTES } from '../constants';
import { useApp } from '../context/AppContext';

const Inspiration: React.FC = () => {
    const { quoteState, updateQuote } = useApp();
    const quote = INSPIRATIONAL_QUOTES[quoteState.index];

    const handleNewQuote = () => {
        updateQuote(true);
    };

    if (!quote) {
        return null; // Caso de fallback se algo der errado com o índice
    }

    return (
        <div className="p-6 md:p-8 min-h-full flex flex-col justify-center items-center text-center">
            <div className="relative border-l-4 border-[var(--accent)] pl-6 py-4">
                 <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-6xl text-[var(--accent)]/20 font-serif">“</span>
                <blockquote className="text-2xl font-medium text-[var(--text-primary)] italic">
                    {quote.quote}
                </blockquote>
                <cite className="block text-right mt-4 text-[var(--text-secondary)] not-italic">— {quote.author}, <span className="italic">{quote.source}</span></cite>
            </div>
            <button
                onClick={handleNewQuote}
                className="mt-12 px-6 py-2 rounded-md bg-[var(--accent)] hover:opacity-90 text-[var(--accent-text)] font-semibold transition-colors"
            >
                Nova Citação
            </button>
        </div>
    );
};

export default Inspiration;
