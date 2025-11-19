import React, { useEffect } from 'react';
import { Achievement } from '../types';
import { AchievementIcon } from './icons/AchievementIcon';

interface AchievementPopupProps {
    achievement: Achievement;
    onDismiss: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 4900); // Um pouco menos que a duração da animação para garantir que saia da árvore

        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:max-w-sm z-50 pointer-events-none">
            <div className="bg-[var(--bg-secondary)] border-2 border-[var(--accent)] rounded-xl shadow-2xl p-4 flex items-center gap-4 animate-achievement-popup pointer-events-auto">
                <div className="flex-shrink-0">
                    <AchievementIcon tier={achievement.tier} iconName={achievement.iconName} size={64} />
                </div>
                <div>
                    <h3 className="font-bold text-[var(--accent)] font-display text-lg">Conquista Desbloqueada!</h3>
                    <p className="font-semibold text-[var(--text-primary)]">{achievement.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{achievement.description}</p>
                </div>
            </div>
        </div>
    );
};

export default AchievementPopup;
