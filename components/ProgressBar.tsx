import React from 'react';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Progresso Diário</span>
                <span className="text-sm font-bold font-display text-[var(--accent)]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2.5">
                <div 
                    className="bg-[var(--accent)] h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;