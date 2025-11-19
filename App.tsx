
import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import FocusScreen from './components/FocusScreen';
import { Task } from './types';
import ConfirmationDialog from './components/ConfirmationDialog';
import LogStudySessionModal from './components/LogStudySessionModal';
import TaskForm from './components/TaskForm';
import BottomNavBar from './components/BottomNavBar';

const AppContent: React.FC = () => {
    const { focusingTask, setFocusingTask, theme, quoteState, updateQuote, checkAndUnlockAchievements, pendingStudySessionLog, isTaskFormOpen, editingTask, closeTaskForm } = useApp();
    
    useEffect(() => {
        if (Date.now() > quoteState.nextUpdate) {
            updateQuote(false);
        }
        checkAndUnlockAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleCompleteFocus = (task: Task, timeSpent: number) => {
        setFocusingTask(null);
    };

    return (
        <div className={`w-full h-screen text-[var(--text-primary)] bg-[var(--bg-primary)] ${theme} flex flex-col`}>
            {focusingTask ? (
                <FocusScreen task={focusingTask} onComplete={handleCompleteFocus} />
            ) : (
                <>
                    <Layout />
                    <BottomNavBar />
                </>
            )}
            <ConfirmationDialog />
            {pendingStudySessionLog && <LogStudySessionModal />}
            {isTaskFormOpen && <TaskForm taskToEdit={editingTask} onClose={closeTaskForm} />}
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;