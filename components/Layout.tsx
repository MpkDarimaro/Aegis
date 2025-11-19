import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Dashboard from './Dashboard';
import Agenda from './Agenda';
import Inspiration from './Inspiration';
import Settings from './Settings';
import Statistics from './Statistics';
import { Achievement } from '../types';
import AchievementPopup from './AchievementPopup';
import StudiesView from './StudiesView';

const Layout: React.FC = () => {
    const { currentView, achievementQueue, popAchievementFromQueue, focusingTask } = useApp();
    const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);

    useEffect(() => {
        if (!currentNotification && achievementQueue.length > 0 && !focusingTask) {
            const nextAchievement = popAchievementFromQueue();
            if (nextAchievement) {
                setCurrentNotification(nextAchievement);
            }
        }
    }, [achievementQueue, popAchievementFromQueue, currentNotification, focusingTask]);


    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard />;
            case 'agenda':
                return <Agenda />;
            case 'studies':
                return <StudiesView />;
            case 'progress':
                return <Statistics />;
            case 'inspiration':
                return <Inspiration />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div 
            className="relative flex flex-col w-full min-h-full max-w-md mx-auto bg-[var(--bg-secondary)] overflow-y-auto pb-16"
            style={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            <main key={currentView} className="animate-view-transition flex-1">
                {renderContent()}
            </main>
            {currentNotification && <AchievementPopup achievement={currentNotification} onDismiss={() => setCurrentNotification(null)} />}
        </div>
    );
};

export default Layout;