
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Task, StudySession } from '../types';
import { StopIcon } from './icons/StopIcon';
import { FlagIcon } from './icons/FlagIcon';
import { ZenModeIcon } from './icons/ZenModeIcon';

interface FocusScreenProps {
    task: Task;
    onComplete: (task: Task, timeSpent: number) => void;
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const FocusScreen: React.FC<FocusScreenProps> = ({ task, onComplete }) => {
    const { toggleTaskCompletion, setFocusingTask, updateFocusProgress, getFocusProgress, addFocusTime, requestStudySessionLog, addStudySession } = useApp();
    const minDurationSecs = useMemo(() => (task.minDuration || 0) * 60, [task.minDuration]);
    
    const [elapsedSeconds, setElapsedSeconds] = useState(() => getFocusProgress(task.id, new Date()));
    const [isZenMode, setIsZenMode] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeRemaining = Math.max(0, minDurationSecs - elapsedSeconds);
    const overtime = Math.max(0, elapsedSeconds - minDurationSecs);
    const isMinTimeMet = elapsedSeconds >= minDurationSecs;

    const handleStop = () => {
        updateFocusProgress(task.id, new Date(), elapsedSeconds);
        setFocusingTask(null);
    };

    const handleComplete = () => {
        requestStudySessionLog({
            durationSeconds: elapsedSeconds,
            onLogComplete: (studyInfo?: Partial<StudySession>) => {
                if (studyInfo?.subjectId) {
                    addStudySession({
                        subjectId: studyInfo.subjectId,
                        durationSeconds: elapsedSeconds,
                        questionsCorrect: studyInfo.questionsCorrect,
                        questionsTotal: studyInfo.questionsTotal,
                    });
                }
                toggleTaskCompletion(task.id, new Date());
                addFocusTime(new Date(), elapsedSeconds);
                updateFocusProgress(task.id, new Date(), 0); // Reset progress on completion
                onComplete(task, elapsedSeconds);
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-[var(--bg-primary)] z-50 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
            <button 
                onClick={() => setIsZenMode(!isZenMode)}
                className="absolute top-5 right-5 p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                aria-label="Alternar Modo Zen"
            >
                <ZenModeIcon />
            </button>
            
            <h1 className="text-[var(--text-secondary)] text-lg mb-4">Focando em:</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-12 max-w-xl truncate">{task.title}</h2>
            
            <div className="mb-12 h-40 flex flex-col justify-center">
                {!isZenMode ? (
                    <div className="animate-fade-in">
                        <p className={`font-display transition-colors duration-500 ${isMinTimeMet ? 'text-green-400' : 'text-[var(--accent)]'} text-8xl md:text-9xl`}>
                            {isMinTimeMet ? `+${formatTime(overtime)}` : formatTime(timeRemaining)}
                        </p>
                        <p className="text-[var(--text-muted)] mt-2">
                            {isMinTimeMet ? "Tempo mínimo atingido. Continue!" : `Duração mínima: ${task.minDuration} minutos`}
                        </p>
                    </div>
                ) : (
                     <div className="animate-fade-in">
                         <p className="text-2xl font-bold text-[var(--text-secondary)]">Modo Zen Ativado</p>
                         <p className="text-[var(--text-muted)]">Concentre-se na missão.</p>
                     </div>
                )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                    onClick={handleStop}
                    className="flex items-center justify-center w-48 py-3 px-6 rounded-lg bg-[var(--bg-tertiary)] hover:opacity-80 text-[var(--text-primary)] font-semibold transition-colors"
                >
                    <StopIcon />
                    <span className="ml-2">Parar e Sair</span>
                </button>

                {isMinTimeMet && (
                     <button
                        onClick={handleComplete}
                        className="flex items-center justify-center w-48 py-3 px-6 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors animate-fade-in"
                    >
                       <FlagIcon />
                       <span className="ml-2">Completar Missão</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default FocusScreen;