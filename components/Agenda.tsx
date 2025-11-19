import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import TaskList from './TaskList';
import { Task } from '../types';

const Agenda: React.FC = () => {
    const { getTasksForDate, openTaskForm } = useApp();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const dates = useMemo(() => {
        const d = [];
        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            d.push(date);
        }
        return d;
    }, []);

    const selectedTasks = useMemo(() => getTasksForDate(selectedDate), [getTasksForDate, selectedDate]);

    const formatDateKey = (date: Date) => date.toISOString().split('T')[0];

    return (
        <div className="p-4 md:p-6 min-h-full">
            <header className="mb-6">
                <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">Agenda</h1>
                <p className="text-[var(--text-secondary)]">Próximas missões</p>
            </header>

            <div className="flex space-x-2 pb-4 overflow-x-auto mb-6 scrollbar-hide">
                {dates.map(date => (
                    <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-shrink-0 w-20 p-3 rounded-lg text-center border transition-colors ${formatDateKey(selectedDate) === formatDateKey(date) ? 'bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)]' : 'bg-[var(--bg-quaternary)] border-[var(--border-color)] hover:bg-[var(--bg-tertiary)]'}`}
                    >
                        <p className="font-bold text-lg">{date.getDate()}</p>
                        <p className="text-xs uppercase">{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                    </button>
                ))}
            </div>

            <div>
                <h2 className="text-xl font-bold font-display mb-4 text-[var(--text-primary)]">
                    {selectedDate.toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })}
                </h2>
                <TaskList tasks={selectedTasks} date={selectedDate} onEdit={openTaskForm} />
            </div>
        </div>
    );
};

export default Agenda;