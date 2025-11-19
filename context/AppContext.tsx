import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Task, TaskCompletion, QuoteState, QuickFocusState, FocusSession, LogEntry, AchievementID, Priority, RecurrenceType, Achievement, Subject, StudySession } from '../types';
import { INSPIRATIONAL_QUOTES } from '../constants';
import { ACHIEVEMENTS_LIST } from '../achievements';
import { saveBackup, loadBackup } from '../services/backup';

interface FocusProgress {
    [taskId: string]: {
        [date: string]: number; // seconds elapsed
    }
}

interface ConfirmationState {
    message: string;
    confirmText: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

interface StudyLogRequest {
    durationSeconds: number;
    onLogComplete: (studyInfo?: Partial<StudySession>) => void;
}

interface AppContextType {
    tasks: Task[];
    completions: TaskCompletion;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'priority'> & { priority?: Priority }) => Task;
    updateTask: (task: Task) => void;
    deleteTask: (taskId: string) => void;
    toggleTaskCompletion: (taskId: string, date: Date) => void;
    isTaskCompleted: (taskId: string, date: Date) => boolean;
    getTasksForDate: (date: Date) => Task[];
    getTaskStreak: (taskId: string, forDate: Date) => number;
    
    currentView: string;
    setCurrentView: (view: string) => void;

    focusingTask: Task | null;
    setFocusingTask: (task: Task | null) => void;

    focusProgress: FocusProgress;
    updateFocusProgress: (taskId: string, date: Date, elapsedSeconds: number) => void;
    getFocusProgress: (taskId: string, date: Date) => number;

    theme: string;
    setTheme: (theme: string) => void;

    confirmation: ConfirmationState | null;
    showConfirmation: (payload: ConfirmationState) => void;
    hideConfirmation: () => void;
    
    quoteState: QuoteState;
    updateQuote: (manual?: boolean) => void;
    
    quickFocus: QuickFocusState;
    setQuickFocus: React.Dispatch<React.SetStateAction<QuickFocusState>>;
    
    focusSessions: FocusSession;
    addFocusTime: (date: Date, seconds: number) => void;

    logs: LogEntry[];
    addLog: (message: string, data?: any) => void;
    
    unlockedAchievements: AchievementID[];
    checkAndUnlockAchievements: () => void;
    
    achievementQueue: Achievement[];
    popAchievementFromQueue: () => Achievement | undefined;

    // Study Module
    subjects: Subject[];
    addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => void;
    updateSubject: (subject: Subject) => void;
    deleteSubject: (subjectId: string) => void;
    resetSubject: (subjectId: string) => void;
    studySessions: StudySession[];
    addStudySession: (session: Omit<StudySession, 'id' | 'date'>) => void;
    pendingStudySessionLog: StudyLogRequest | null;
    requestStudySessionLog: (request: StudyLogRequest) => void;
    clearStudySessionLogRequest: () => void;

    isTaskFormOpen: boolean;
    editingTask: Task | null;
    openTaskForm: (task: Task | null) => void;
    closeTaskForm: () => void;
    restoreStateFromBackup: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completions, setCompletions] = useState<TaskCompletion>({});
    const [focusProgress, setFocusProgress] = useState<FocusProgress>({});
    const [theme, setTheme] = useLocalStorage<string>('aegis_theme', 'theme-default');
    const [quoteState, setQuoteState] = useLocalStorage<QuoteState>('aegis_quote_state', { index: 0, nextUpdate: 0 });
    const [quickFocus, setQuickFocus] = useLocalStorage<QuickFocusState>('aegis_quick_focus', { time: 0, isActive: false });
    const [focusSessions, setFocusSessions] = useState<FocusSession>({});
    const [logs, setLogs] = useLocalStorage<LogEntry[]>('aegis_logs', []);
    const [unlockedAchievements, setUnlockedAchievements] = useState<AchievementID[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [studySessions, setStudySessions] = useState<StudySession[]>([]);
    
    const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
    const [currentView, setCurrentView] = useState('dashboard');
    const [focusingTask, setFocusingTask] = useState<Task | null>(null);
    const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null);
    const [pendingStudySessionLog, setPendingStudySessionLog] = useState<StudyLogRequest | null>(null);
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const restoreStateFromBackup = async (): Promise<boolean> => {
        const result = await loadBackup();
        if (result.error) {
            alert(result.error);
            return false;
        }
        if (result.data) {
            setTasks(result.data.tasks || []);
            setCompletions(result.data.completions || {});
            setFocusProgress(result.data.focusProgress || {});
            setFocusSessions(result.data.focusSessions || {});
            setUnlockedAchievements(result.data.unlockedAchievements || []);
            setSubjects(result.data.subjects || []);
            setStudySessions(result.data.studySessions || []);
            return true;
        }
        // No backup found, which is a valid state on first launch
        return true;
    };


    const addLog = (message: string, data?: any) => {
        try {
            const newLog: LogEntry = {
                timestamp: Date.now(),
                message,
                data: data ? JSON.stringify(data, null, 2) : undefined
            };
            setLogs(prev => [...prev, newLog].slice(-3));
        } catch (error) {
            console.error("Failed to add log:", error);
        }
    };
    
    const isTaskCompleted = useCallback((taskId: string, date: Date): boolean => {
        const dateString = formatDate(date);
        return completions[taskId]?.[dateString] || false;
    }, [completions]);
    
     const getTasksForDate = useCallback((date: Date): Task[] => {
        const dateString = formatDate(date);
        const dayOfWeek = date.getDay();
        const priorityOrder: { [key in Priority]: number } = { [Priority.HIGH]: 1, [Priority.MEDIUM]: 2, [Priority.LOW]: 3 };

        return tasks.filter(task => {
            switch (task.recurrence) {
                case RecurrenceType.DAILY:
                    return true;
                case RecurrenceType.ONCE:
                    return task.specificDate === dateString;
                case RecurrenceType.WEEKLY:
                    return task.repeatDays?.includes(dayOfWeek) ?? false;
                default:
                    return false;
            }
        }).sort((a,b) => {
            const priorityA = priorityOrder[a.priority];
            const priorityB = priorityOrder[b.priority];
            if(priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            return a.createdAt - b.createdAt;
        });
    }, [tasks]);

    const getTaskStreak = useCallback((taskId: string, forDate: Date): number => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || (task.recurrence !== RecurrenceType.DAILY && task.recurrence !== RecurrenceType.WEEKLY)) {
            return 0;
        }

        let streak = 0;
        let currentDate = new Date(forDate);

        if (!isTaskCompleted(taskId, currentDate)) {
             currentDate.setDate(currentDate.getDate() - 1);
        }

        while (true) {
            const dayOfWeek = currentDate.getDay();
            let shouldHaveRun = false;
            if (task.recurrence === RecurrenceType.DAILY) {
                shouldHaveRun = true;
            } else if (task.recurrence === RecurrenceType.WEEKLY && task.repeatDays?.includes(dayOfWeek)) {
                shouldHaveRun = true;
            }

            if (shouldHaveRun) {
                if (isTaskCompleted(taskId, currentDate)) {
                    streak++;
                } else {
                    break; 
                }
            }
            currentDate.setDate(currentDate.getDate() - 1);
             if (streak > 365) break; // safety break
        }

        return streak;
    }, [tasks, isTaskCompleted]);
    
    const checkAndUnlockAchievements = useCallback(() => {
        const contextData = {
            tasks,
            completions,
            focusSessions,
            subjects,
            studySessions,
            getTaskStreak,
            getTasksForDate,
            unlockedAchievements,
        };
        const newAchievements: Achievement[] = [];
        ACHIEVEMENTS_LIST.forEach(ach => {
            if (!unlockedAchievements.includes(ach.id)) {
                if (ach.condition(contextData)) {
                    newAchievements.push(ach);
                }
            }
        });
        if (newAchievements.length > 0) {
            setUnlockedAchievements(prev => [...new Set([...prev, ...newAchievements.map(a => a.id)])]);
            setAchievementQueue(prev => [...prev, ...newAchievements]);
            addLog(`Conquistas desbloqueadas: ${newAchievements.map(a => a.name).join(', ')}`);
        }
    }, [tasks, completions, focusSessions, subjects, studySessions, getTaskStreak, unlockedAchievements, addLog, setUnlockedAchievements, getTasksForDate]);

    const popAchievementFromQueue = (): Achievement | undefined => {
        if (achievementQueue.length === 0) return undefined;
        const [first, ...rest] = achievementQueue;
        setAchievementQueue(rest);
        return first;
    };

    const showConfirmation = (payload: ConfirmationState) => setConfirmation(payload);
    const hideConfirmation = () => {
        if (confirmation?.onCancel) {
            confirmation.onCancel();
        }
        setConfirmation(null);
    };

    const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'priority'> & { priority?: Priority }): Task => {
        try {
            const newTask: Task = {
                ...taskData,
                id: crypto.randomUUID(),
                createdAt: Date.now(),
                priority: taskData.priority || Priority.MEDIUM,
            };
            setTasks(prev => [...prev, newTask]);
            addLog('Task added', { title: newTask.title, id: newTask.id });
            return newTask;
        } catch (error) {
            addLog('Error adding task', { error, taskData });
            throw error;
        }
    };

    const updateTask = (updatedTask: Task) => {
        try {
            setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
            addLog('Task updated', { id: updatedTask.id });
        } catch (error) {
             addLog('Error updating task', { error, taskId: updatedTask.id });
        }
    };

    const deleteTask = (taskId: string) => {
       try {
            setTasks(prev => prev.filter(task => task.id !== taskId));
            
            setCompletions(prev => {
                const newCompletions = { ...prev };
                delete newCompletions[taskId];
                return newCompletions;
            });

            setFocusProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[taskId];
                return newProgress;
            });
            addLog('Task deleted', { taskId });
        } catch(error) {
             addLog('Error deleting task', { error, taskId });
        }
    };
    
    const toggleTaskCompletion = (taskId: string, date: Date) => {
        try {
            const dateString = formatDate(date);
            setCompletions(prev => {
                const newCompletions = { ...prev };
                if (!newCompletions[taskId]) {
                    newCompletions[taskId] = {};
                }
                newCompletions[taskId][dateString] = !newCompletions[taskId][dateString];
                return newCompletions;
            });
            setTimeout(checkAndUnlockAchievements, 100); // Check after state update
        } catch (error) {
            addLog('Error toggling task completion', { error, taskId });
        }
    };
    
    const updateFocusProgress = (taskId: string, date: Date, elapsedSeconds: number) => {
       try {
            const dateString = formatDate(date);
            setFocusProgress(prev => {
                const newProgress = { ...prev };
                if (!newProgress[taskId]) {
                    newProgress[taskId] = {};
                }
                newProgress[taskId][dateString] = elapsedSeconds;
                return newProgress;
            });

            const task = tasks.find(t => t.id === taskId);
            if (task && !task.isImmutable && elapsedSeconds > 0) {
                updateTask({ ...task, isImmutable: true });
                addLog('Task marked as immutable', { taskId });
            }
        } catch(error) {
            addLog('Error updating focus progress', { error, taskId });
        }
    };

    const getFocusProgress = (taskId: string, date: Date): number => {
        const dateString = formatDate(date);
        return focusProgress[taskId]?.[dateString] || 0;
    };
    
    const updateQuote = (manual = false) => {
        setQuoteState(prev => {
            let newIndex = prev.index;
            if (INSPIRATIONAL_QUOTES.length > 1) {
                while (newIndex === prev.index) {
                    newIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
                }
            }
            
            const now = Date.now();
            let nextUpdate = now + SIX_HOURS_MS;
            
            if (manual) {
                const proposedNextUpdate = prev.nextUpdate + THREE_HOURS_MS;
                nextUpdate = Math.min(proposedNextUpdate, nextUpdate);
            }

            return { index: newIndex, nextUpdate };
        });
    };

    const addFocusTime = (date: Date, seconds: number) => {
        try {
            const dateString = formatDate(date);
            setFocusSessions(prev => ({
                ...prev,
                [dateString]: (prev[dateString] || 0) + seconds
            }));
            setTimeout(checkAndUnlockAchievements, 100);
        } catch(error) {
            addLog('Error adding focus time', { error, date: formatDate(date), seconds });
        }
    };

    // Study Module Functions
    const addSubject = (subjectData: Omit<Subject, 'id' | 'createdAt'>) => {
        const newSubject: Subject = {
            ...subjectData,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };
        setSubjects(prev => [...prev, newSubject]);
    };

    const updateSubject = (updatedSubject: Subject) => {
        setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
    };

    const deleteSubject = (subjectId: string) => {
        setSubjects(prev => prev.filter(s => s.id !== subjectId));
        // Optional: also remove related study sessions
        setStudySessions(prev => prev.filter(ss => ss.subjectId !== subjectId));
    };

    const resetSubject = (subjectId: string) => {
        setStudySessions(prev => prev.filter(ss => ss.subjectId !== subjectId));
    };

    const addStudySession = (sessionData: Omit<StudySession, 'id' | 'date'>) => {
        const newSession: StudySession = {
            ...sessionData,
            id: crypto.randomUUID(),
            date: formatDate(new Date()),
        };
        setStudySessions(prev => [...prev, newSession]);
        setTimeout(checkAndUnlockAchievements, 100);
    };

    const requestStudySessionLog = (request: StudyLogRequest) => {
        setPendingStudySessionLog(request);
    };

    const clearStudySessionLogRequest = () => {
        setPendingStudySessionLog(null);
    };

    const openTaskForm = (task: Task | null) => {
        setEditingTask(task);
        setIsTaskFormOpen(true);
    };

    const closeTaskForm = () => {
        setEditingTask(null);
        setIsTaskFormOpen(false);
    };


    const value = {
        tasks,
        completions,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        isTaskCompleted,
        getTasksForDate,
        getTaskStreak,
        currentView,
        setCurrentView,
        focusingTask,
        setFocusingTask,
        focusProgress,
        updateFocusProgress,
        getFocusProgress,
        theme,
        setTheme,
        confirmation,
        showConfirmation,
        hideConfirmation,
        quoteState,
        updateQuote,
        quickFocus,
        setQuickFocus,
        focusSessions,
        addFocusTime,
        logs,
        addLog,
        unlockedAchievements,
        checkAndUnlockAchievements,
        achievementQueue,
        popAchievementFromQueue,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        resetSubject,
        studySessions,
        addStudySession,
        pendingStudySessionLog,
        requestStudySessionLog,
        clearStudySessionLogRequest,
        isTaskFormOpen,
        editingTask,
        openTaskForm,
        closeTaskForm,
        restoreStateFromBackup,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};