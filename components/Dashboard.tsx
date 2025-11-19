import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import TaskList from './TaskList';
import ProgressBar from './ProgressBar';
import { Task } from '../types';
import QuickFocus from './QuickFocus';

const Dashboard: React.FC = () => {
    const { getTasksForDate, isTaskCompleted, openTaskForm } = useApp();

    const today = useMemo(() => new Date(), []);
    const todaysTasks = useMemo(() => getTasksForDate(today), [getTasksForDate, today]);

    const completedTasksCount = useMemo(() => {
        return todaysTasks.filter(task => isTaskCompleted(task.id, today)).length;
    }, [todaysTasks, isTaskCompleted, today]);

    const progress = todaysTasks.length > 0 ? (completedTasksCount / todaysTasks.length) * 100 : 0;

    return (
        <div className="p-4 md:p-6 min-h-full">
            <header className="mb-6">
                <div className="flex justify-between items-center mb-1">
                    <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">Missão de Hoje</h1>
                    <span className="text-xl font-bold font-display text-[var(--accent)]">{new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}</span>
                </div>
                <p className="text-[var(--text-secondary)]">{new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            <div className="mb-6">
                <ProgressBar progress={progress} />
            </div>
            
            <div className="mb-6">
                <QuickFocus />
            </div>

            <TaskList tasks={todaysTasks} date={today} onEdit={(task) => openTaskForm(task)} />
        </div>
    );
};

export default Dashboard;