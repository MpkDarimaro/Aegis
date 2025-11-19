import React from 'react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS_LIST } from '../achievements';
import { AchievementIcon } from './icons/AchievementIcon';

const AchievementsView: React.FC = () => {
    const { unlockedAchievements } = useApp();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2">
            {ACHIEVEMENTS_LIST.map(achievement => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);
                return (
                    <div 
                        key={achievement.id}
                        className={`p-4 rounded-xl flex flex-col items-center justify-start text-center border transition-all duration-300
                        ${isUnlocked 
                            ? 'border-[var(--accent)] bg-[var(--bg-secondary)] shadow-lg shadow-[var(--accent-shadow)]' 
                            : 'bg-[var(--bg-quaternary)]/50 border-[var(--border-color)]'}`}
                    >
                        <div className={`transition-all duration-500 ${!isUnlocked ? 'grayscale opacity-50' : ''}`}>
                           <AchievementIcon tier={achievement.tier} iconName={achievement.iconName} />
                        </div>
                        <h3 className={`mt-3 font-bold font-display ${isUnlocked ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{achievement.name}</h3>
                        <p className={`mt-1 text-xs ${isUnlocked ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>{achievement.description}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default AchievementsView;