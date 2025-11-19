import React from 'react';

export const TrophyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="var(--accent)" stroke="var(--accent)"></path>
        <path d="M12 8v10" stroke="var(--accent-text)" strokeOpacity="0.5"></path>
        <path d="M12 12l4-2" stroke="var(--accent-text)" strokeOpacity="0.5"></path>
        <path d="M12 12l-4-2" stroke="var(--accent-text)" strokeOpacity="0.5"></path>
        <path d="M12 12l4 2" stroke="var(--accent-text)" strokeOpacity="0.5"></path>
        <path d="M12 12l-4 2" stroke="var(--accent-text)" strokeOpacity="0.5"></path>
    </svg>
);