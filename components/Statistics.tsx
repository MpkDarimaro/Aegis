import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Task, FocusSession, TaskType } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { CheckIcon } from './icons/CheckIcon';
import { NoteIcon } from './icons/NoteIcon';
import AchievementsView from './AchievementsView';

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const formatFocusTime = (seconds: number) => {
    if (!seconds || seconds < 1) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    return `${minutes}m`;
};


const TaskDetailRow: React.FC<{ task: Task; isCompleted: boolean }> = ({ task, isCompleted }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div 
            className={`p-2 rounded-md ${isCompleted ? 'bg-green-500/10' : 'bg-[var(--bg-tertiary)]/50'} ${task.description ? 'cursor-pointer' : ''}`}
            onClick={() => task.description && setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center">
                 <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full mr-3 ${isCompleted ? 'bg-green-500' : 'border-2 border-[var(--border-color)]'}`}>
                    {isCompleted && <CheckIcon isCompleted={true} />}
                </div>
                <div className="flex-1 min-w-0">
                    <span className={`text-sm ${isCompleted ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}>{task.title}</span>
                </div>
                 {task.type === TaskType.FOCUS && task.minDuration && (
                    <div className="flex items-center text-xs text-[var(--text-muted)] ml-2">
                        <ClockIcon />
                        <span className="ml-1">{task.minDuration}m</span>
                    </div>
                )}
                 {task.description && <span className="text-[var(--text-muted)] ml-2"><NoteIcon/></span>}
            </div>
            {isExpanded && task.description && (
                 <p className="mt-2 pl-8 text-xs text-[var(--text-secondary)] whitespace-pre-wrap animate-fade-in">{task.description}</p>
            )}
        </div>
    );
};


const DayDetailModal: React.FC<{ day: { date: Date }, onClose: () => void }> = ({ day, onClose }) => {
    const { getTasksForDate, isTaskCompleted, focusSessions } = useApp();

    const tasksForDay = useMemo(() => getTasksForDate(day.date), [getTasksForDate, day.date]);
    const completedTasks = useMemo(() => tasksForDay.filter(t => isTaskCompleted(t.id, day.date)), [tasksForDay, isTaskCompleted, day.date]);
    const focusTime = focusSessions[formatDate(day.date)] || 0;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-md p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold font-display text-[var(--text-primary)]">{day.date.toLocaleString('pt-BR', { weekday: 'long' })}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{day.date.toLocaleString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                     <button onClick={onClose} className="text-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]">&times;</button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                    <div className="bg-[var(--bg-quaternary)] p-3 rounded-lg">
                        <p className="text-sm text-[var(--text-secondary)]">Tempo de Foco</p>
                        <p className="text-2xl font-bold font-display text-[var(--accent)]">{formatFocusTime(focusTime)}</p>
                    </div>
                     <div className="bg-[var(--bg-quaternary)] p-3 rounded-lg">
                        <p className="text-sm text-[var(--text-secondary)]">Missões Concluídas</p>
                        <p className="text-2xl font-bold font-display text-[var(--text-primary)]">{completedTasks.length}/{tasksForDay.length}</p>
                    </div>
                </div>

                <h4 className="font-semibold text-[var(--text-primary)] mb-3">Missões do Dia</h4>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                    {tasksForDay.length > 0 ? tasksForDay.map(task => {
                        const isCompleted = completedTasks.some(ct => ct.id === task.id);
                        return <TaskDetailRow key={task.id} task={task} isCompleted={isCompleted} />;
                    }) : <p className="text-sm text-center text-[var(--text-muted)] py-4">Nenhuma missão agendada.</p>}
                </div>

            </div>
        </div>
    );
};


const Statistics: React.FC = () => {
    const { getTasksForDate, isTaskCompleted, focusSessions } = useApp();
    const [view, setView] = useState<'weekly' | 'monthly' | 'yearly' | 'achievements'>('weekly');

    const renderContent = () => {
        switch (view) {
            case 'weekly':
                return <WeeklyStats getTasksForDate={getTasksForDate} isTaskCompleted={isTaskCompleted} focusSessions={focusSessions} />;
            case 'monthly':
                return <MonthlyStats getTasksForDate={getTasksForDate} isTaskCompleted={isTaskCompleted} focusSessions={focusSessions} />;
            case 'yearly':
                return <YearlyStats getTasksForDate={getTasksForDate} isTaskCompleted={isTaskCompleted} />;
            case 'achievements':
                return <AchievementsView />;
            default:
                return null;
        }
    };

    return (
        <div className="p-4 md:p-6 min-h-full">
            <header className="mb-6">
                <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">Progresso</h1>
                <p className="text-[var(--text-secondary)]">Sua jornada de disciplina.</p>
            </header>
            <nav className="flex space-x-1 p-1 bg-[var(--bg-quaternary)] rounded-lg mb-6">
                <TabButton id="weekly" label="Semanal" activeView={view} setView={setView} />
                <TabButton id="monthly" label="Mensal" activeView={view} setView={setView} />
                <TabButton id="yearly" label="Anual" activeView={view} setView={setView} />
                <TabButton id="achievements" label="Conquistas" activeView={view} setView={setView} />
            </nav>
            <div className="animate-fade-in">{renderContent()}</div>
        </div>
    );
};

const TabButton: React.FC<{ id: string, label: string, activeView: string, setView: Function }> = ({ id, label, activeView, setView }) => (
    <button
        onClick={() => setView(id)}
        className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${activeView === id ? 'bg-[var(--accent)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
    >
        {label}
    </button>
);

const ChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);
const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);

const WeeklyStats: React.FC<{ getTasksForDate: (date: Date) => Task[], isTaskCompleted: (taskId: string, date: Date) => boolean, focusSessions: FocusSession }> = ({ getTasksForDate, isTaskCompleted, focusSessions }) => {
    const [selectedDay, setSelectedDay] = useState<{ date: Date } | null>(null);

    const weeklyData = useMemo(() => {
        const today = new Date();
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - i));
            const tasks = getTasksForDate(date);
            const completedCount = tasks.filter((t: any) => isTaskCompleted(t.id, date)).length;
            const focusSeconds = focusSessions[formatDate(date)] || 0;
            return {
                date,
                label: date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
                completedCount,
                focusSeconds,
            };
        });
    }, [getTasksForDate, isTaskCompleted, focusSessions]);

    const maxFocus = Math.max(1, ...weeklyData.map(d => d.focusSeconds));
    const maxTasks = Math.max(1, ...weeklyData.map(d => d.completedCount));

    return (
        <>
        <div className="p-4 bg-[var(--bg-quaternary)]/50 rounded-lg">
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Resumo dos Últimos 7 Dias</h3>
            <div className="flex justify-between items-center h-56 space-x-2">
                {weeklyData.map((day, i) => (
                    <button 
                        key={i} 
                        onClick={() => setSelectedDay({ date: day.date })}
                        className="flex-1 h-full flex flex-col items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-md transition-shadow"
                    >
                        {/* Focus Bar (Up) */}
                        <div className="w-full flex-1 flex flex-col-reverse">
                            <div
                                className="w-3/4 mx-auto bg-[var(--accent)]/80 rounded-t-sm transition-all duration-500"
                                style={{ height: `${(day.focusSeconds / maxFocus) * 100}%` }}
                                title={`Foco: ${formatFocusTime(day.focusSeconds)}`}
                            />
                        </div>
                        <span className="text-xs font-bold text-[var(--text-secondary)] my-1.5">{day.label}</span>
                        {/* Tasks Bar (Down) */}
                        <div className="w-full flex-1">
                             <div
                                className="w-3/4 mx-auto bg-green-500/70 rounded-b-sm transition-all duration-500"
                                style={{ height: `${(day.completedCount / maxTasks) * 100}%` }}
                                title={`Tarefas: ${day.completedCount}`}
                            />
                        </div>
                    </button>
                ))}
            </div>
             <div className="flex justify-center text-xs text-[var(--text-muted)] mt-4 space-x-4">
                <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-[var(--accent)]/80 mr-2"></span>Horas de Foco</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-green-500/70 mr-2"></span>Tarefas Concluídas</div>
            </div>
        </div>
        {selectedDay && <DayDetailModal day={selectedDay} onClose={() => setSelectedDay(null)} />}
        </>
    );
};


const MonthlyStats: React.FC<{ getTasksForDate: (date: Date) => Task[], isTaskCompleted: (taskId: string, date: Date) => boolean, focusSessions: { [date: string]: number } }> = ({ getTasksForDate, isTaskCompleted, focusSessions }) => {
    const [viewDate, setViewDate] = useState(new Date());

    const isSameDay = useMemo(() => (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate(), []);

    const calendarData = useMemo(() => {
        const today = new Date();
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const data = Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(year, month, i + 1);
            const dateString = formatDate(date);
            const tasks = getTasksForDate(date);
            const completedTasks = tasks.filter(t => isTaskCompleted(t.id, date));
            
            let borderColor = 'border-transparent';
            if(date < today && !isSameDay(date, today)) {
                borderColor = completedTasks.length > 0 ? 'border-green-500/80' : 'border-red-500/80';
            } else if (isSameDay(date, today)) {
                borderColor = completedTasks.length > 0 ? 'border-green-500/80' : 'border-[var(--border-color)]';
            } else {
                 borderColor = 'border-[var(--border-color)]/50';
            }

            return {
                day: i + 1,
                borderColor,
                totalTasks: tasks.length,
                completedCount: completedTasks.length,
                focusTime: focusSessions[dateString] || 0,
            };
        });
        
        const emptyCells = Array.from({ length: firstDayOfMonth }).map((_, i) => ({ day: `empty-${i}` }));
        
        return { year, month, cells: [...emptyCells, ...data] };
    }, [viewDate, getTasksForDate, isTaskCompleted, focusSessions, isSameDay]);
    
    const handlePrevMonth = () => setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const handleNextMonth = () => setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="p-4 bg-[var(--bg-quaternary)]/50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"><ChevronLeft/></button>
                <h3 className="font-bold text-[var(--text-primary)] text-center">{viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"><ChevronRight/></button>
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-[var(--text-muted)] mb-2">
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
                {calendarData.cells.map((dayData) => {
                    if (typeof dayData.day === 'string') {
                        return <div key={dayData.day} />;
                    }
// Fix: Use an early return to help TypeScript correctly narrow the type of dayData.
// This resolves the issue where properties of data cells were not accessible.
                    const { day, borderColor, focusTime, completedCount, totalTasks } = dayData;
                    const formattedFocusTime = formatFocusTime(focusTime);
                    return (
                        <div 
                            key={day} 
                            className={`w-full aspect-square rounded-lg border-2 ${borderColor} bg-[var(--bg-tertiary)]/30 p-1 flex flex-col justify-between`}
                            title={`Dia ${day}`}
                        >
                            <span className="font-bold text-xs text-left text-[var(--text-secondary)]">{day}</span>
                            <div className="text-center">
                                {formattedFocusTime && formattedFocusTime !== '0m' && <div className="text-[10px] font-bold text-[var(--accent)] leading-tight">{formattedFocusTime}</div>}
                                {totalTasks > 0 && <div className="text-[9px] text-[var(--text-muted)] leading-tight">{completedCount}/{totalTasks}</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const YearlyStats: React.FC<{ getTasksForDate: (date: Date) => Task[], isTaskCompleted: (taskId: string, date: Date) => boolean }> = ({ getTasksForDate, isTaskCompleted }) => {
    const [viewYear, setViewYear] = useState(new Date().getFullYear());

     const yearlyData = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => {
            const month = i;
            const daysInMonth = new Date(viewYear, month + 1, 0).getDate();
            let totalPercentage = 0;
            let daysWithTasks = 0;
            for(let d = 1; d <= daysInMonth; d++) {
                const date = new Date(viewYear, month, d);
                const tasks = getTasksForDate(date);
                if (tasks.length > 0) {
                    daysWithTasks++;
                    const completed = tasks.filter((t: any) => isTaskCompleted(t.id, date)).length;
                    totalPercentage += (completed / tasks.length) * 100;
                }
            }
            return {
                label: new Date(viewYear, month).toLocaleDateString('pt-BR', { month: 'short' }).slice(0, 3),
                percentage: daysWithTasks > 0 ? totalPercentage / daysWithTasks : 0,
            };
        });
    }, [viewYear, getTasksForDate, isTaskCompleted]);
    
    const handlePrevYear = () => setViewYear(prev => prev - 1);
    const handleNextYear = () => setViewYear(prev => prev + 1);
    
     return (
        <div className="p-4 bg-[var(--bg-quaternary)]/50 rounded-lg">
             <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevYear} className="p-1 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"><ChevronLeft/></button>
                <h3 className="font-bold text-[var(--text-primary)]">Média Anual de {viewYear}</h3>
                <button onClick={handleNextYear} className="p-1 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"><ChevronRight/></button>
            </div>
             <div className="flex justify-between items-end h-48 space-x-1">
                 {yearlyData.map((month, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full h-full flex items-end">
                            <div
                                className="w-full bg-[var(--accent)] rounded-t-sm transition-all duration-500"
                                style={{ height: `${month.percentage}%` }}
                                title={`${Math.round(month.percentage)}%`}
                            />
                        </div>
                        <span className="text-xs text-[var(--text-muted)] mt-2">{month.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Statistics;