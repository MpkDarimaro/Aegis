import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlayIcon } from './icons/PlayIcon';
import { FlagIcon } from './icons/FlagIcon';
import { RecurrenceType, TaskType, StudySession } from '../types';

const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const NamingModal: React.FC<{ onSave: (name: string) => void; onCancel: () => void; timeSpent: number }> = ({ onSave, onCancel, timeSpent }) => {
    const [name, setName] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name.trim()) {
            onSave(name.trim());
        }
    }
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={onCancel}>
             <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold font-display text-[var(--text-primary)] mb-2">Missão Cumprida</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Você focou por <span className="font-bold text-[var(--accent)]">{formatTime(timeSpent)}</span>. Dê um nome para esta tarefa.</p>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none" 
                        placeholder="Ex: Respondi e-mails importantes"
                        required 
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-[var(--bg-tertiary)] hover:opacity-80 text-[var(--text-primary)] transition-colors">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-[var(--accent)] hover:opacity-90 text-[var(--accent-text)] font-semibold transition-colors">Avançar</button>
                    </div>
                </form>
             </div>
        </div>
    )
}


const QuickFocus: React.FC = () => {
    const { quickFocus, setQuickFocus, addTask, toggleTaskCompletion, addFocusTime, requestStudySessionLog, addStudySession } = useApp();
    const intervalRef = useRef<number | null>(null);
    const [isNaming, setIsNaming] = useState(false);
    const timeSpentOnStop = useRef(0);

    useEffect(() => {
        if (quickFocus.isActive) {
            intervalRef.current = window.setInterval(() => {
                setQuickFocus(prev => ({ ...prev, time: prev.time + 1 }));
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [quickFocus.isActive, setQuickFocus]);

    const handleToggle = () => {
        setQuickFocus(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleStop = () => {
        const currentTime = quickFocus.time;
        timeSpentOnStop.current = currentTime;
        setQuickFocus(prev => ({ ...prev, isActive: false }));

        if (currentTime > 5) { // Only log if more than 5 seconds
            setIsNaming(true);
        } else {
            setQuickFocus({ time: 0, isActive: false });
        }
    };
    
    const handleSaveTask = (name: string) => {
        const timeSpent = timeSpentOnStop.current;
        setIsNaming(false);
        
        requestStudySessionLog({
            durationSeconds: timeSpent,
            onLogComplete: (studyInfo?: Partial<StudySession>) => {
                if (studyInfo?.subjectId) {
                    addStudySession({
                        subjectId: studyInfo.subjectId,
                        durationSeconds: timeSpent,
                        questionsCorrect: studyInfo.questionsCorrect,
                        questionsTotal: studyInfo.questionsTotal,
                    });
                }
                const today = new Date();
                const newTask = addTask({
                    title: name,
                    type: TaskType.FOCUS,
                    minDuration: Math.max(1, Math.ceil(timeSpent / 60)),
                    recurrence: RecurrenceType.ONCE,
                    specificDate: today.toISOString().split('T')[0],
                    isImmutable: true,
                });
                toggleTaskCompletion(newTask.id, today);
                addFocusTime(today, timeSpent);
                
                setQuickFocus({ time: 0, isActive: false });
            }
        });
    }

    const handleCancelNaming = () => {
        setIsNaming(false);
        setQuickFocus({ time: 0, isActive: false });
    };

    return (
        <>
            <div className="p-4 bg-[var(--bg-quaternary)]/50 rounded-lg border border-[var(--border-color)] flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-[var(--text-secondary)]">Foco Rápido</h3>
                    <p className="text-3xl font-bold font-display text-[var(--text-primary)] tracking-wider">{formatTime(quickFocus.time)}</p>
                </div>
                <div className="flex items-center gap-2">
                    {quickFocus.time > 0 && (
                        <button
                            onClick={handleStop}
                            className="w-12 h-12 flex items-center justify-center bg-[var(--bg-tertiary)] text-[var(--accent)] rounded-full hover:bg-slate-600 transition-colors"
                            aria-label="Finalizar Foco Rápido"
                        >
                            <FlagIcon />
                        </button>
                    )}
                    <button
                        onClick={handleToggle}
                        className="w-12 h-12 flex items-center justify-center bg-[var(--accent)] text-[var(--accent-text)] rounded-full hover:opacity-90 transition-opacity"
                        aria-label={quickFocus.isActive ? "Pausar Foco Rápido" : "Iniciar Foco Rápido"}
                    >
                        {quickFocus.isActive ? <PauseIcon /> : <PlayIcon />}
                    </button>
                </div>
            </div>
            {isNaming && <NamingModal onSave={handleSaveTask} onCancel={handleCancelNaming} timeSpent={timeSpentOnStop.current}/>}
        </>
    );
};

export default QuickFocus;