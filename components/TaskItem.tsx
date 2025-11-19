
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskType, Priority, RecurrenceType } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { CheckIcon } from './icons/CheckIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import { ClockIcon } from './icons/ClockIcon';
import { NoteIcon } from './icons/NoteIcon';
import { EagleIcon } from './icons/EagleIcon';

interface TaskItemProps {
    task: Task;
    date: Date;
    onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, date, onEdit }) => {
    const { toggleTaskCompletion, isTaskCompleted, deleteTask, setFocusingTask, showConfirmation, getTaskStreak } = useApp();
    const isCompleted = isTaskCompleted(task.id, date);
    
    const [isCompleting, setIsCompleting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPendingDeletion, setIsPendingDeletion] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const streak = useMemo(() => {
        if (task.recurrence === RecurrenceType.DAILY || task.recurrence === RecurrenceType.WEEKLY) {
            return getTaskStreak(task.id, date);
        }
        return 0;
    }, [task.id, task.recurrence, date, getTaskStreak, isCompleted]);

    const handleAction = () => {
        if (task.type === TaskType.FOCUS) {
            if (!isCompleted) {
                setFocusingTask(task);
            }
        } else {
             if (!task.isImmutable || task.type === TaskType.COMMON) {
                if (!isCompleted) {
                    setIsCompleting(true);
                }
                toggleTaskCompletion(task.id, date);
             }
        }
    };
    
    const handleDelete = () => {
        setIsPendingDeletion(true);
        showConfirmation({
            message: `Tem certeza de que deseja excluir a missão "${task.title}"?`,
            confirmText: "Excluir",
            onConfirm: () => {
                setIsDeleting(true);
            },
            onCancel: () => {
                setIsPendingDeletion(false);
            },
        });
    };
    
    const handleAnimationEnd = () => {
        if (isDeleting) {
            deleteTask(task.id);
        }
        if (isCompleting) {
            setIsCompleting(false);
        }
    };

    const isActionButtonDisabled = (task.type === TaskType.FOCUS || task.isImmutable) && isCompleted;

    const getDynamicClasses = () => {
        let classes = 'border-l-4 ';
        if (isPendingDeletion) {
             classes += 'border-red-500/80 border-l-red-500/80';
        } else if (isCompleted) {
            classes += 'bg-green-900/30 border-green-500/30 border-l-green-500/30';
        } else {
            classes += 'border-[var(--border-color)] ';
            if (task.priority === Priority.HIGH) {
                 classes += 'border-l-[var(--accent)]';
            } else {
                 classes += 'border-l-transparent';
            }
        }
        return classes;
    };

    return (
        <div 
            className={`bg-[var(--bg-quaternary)]/50 rounded-lg border transition-all duration-300 ${getDynamicClasses()} ${isDeleting ? 'task-deleting' : ''}`}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className={`group flex items-center p-3`}>
                <button
                    onClick={handleAction}
                    disabled={isActionButtonDisabled}
                    className={`w-12 h-12 flex-shrink-0 rounded-md flex items-center justify-center mr-4 transition-colors duration-300 
                    ${isCompleted ? 'bg-green-500/80 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--accent)]'} 
                    ${isActionButtonDisabled ? 'cursor-not-allowed opacity-70' : 'hover:bg-slate-600'}
                    ${isCompleting ? 'task-completing' : ''}`}
                    aria-label={task.type === TaskType.FOCUS ? "Iniciar foco" : "Completar tarefa"}
                >
                    {(task.type === TaskType.COMMON || (task.type === TaskType.FOCUS && isCompleted)) ? <CheckIcon isCompleted={isCompleted} /> : <PlayIcon />}
                </button>
                <div 
                    className={`flex-1 min-w-0 ${task.description ? 'cursor-pointer' : ''}`}
                    onClick={() => task.description && setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-2">
                        <p className={`font-semibold transition-colors duration-300 ${isCompleted ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'} ${!isExpanded ? 'truncate' : ''}`}>
                            {task.title}
                        </p>
                        {task.description && <span className="text-[var(--text-muted)]"><NoteIcon /></span>}
                    </div>
                    <div className="flex items-center text-xs text-[var(--text-secondary)] mt-1 space-x-3">
                        {task.type === TaskType.FOCUS && task.minDuration && (
                            <div className="flex items-center">
                                <ClockIcon />
                                <span className="ml-1">{task.minDuration} min</span>
                            </div>
                        )}
                        {streak > 0 && (
                             <div className="flex items-center text-[var(--accent)] font-bold">
                                <EagleIcon />
                                <span className="ml-1">{streak}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(task)} className="p-2 text-[var(--text-secondary)] hover:text-white" aria-label="Editar tarefa">
                        <PencilIcon />
                    </button>
                    <button onClick={handleDelete} className="p-2 text-[var(--text-secondary)] hover:text-red-500" aria-label="Excluir tarefa">
                        <TrashIcon />
                    </button>
                </div>
            </div>
             {isExpanded && task.description && (
                <div className="px-3 pb-3 ml-[68px] text-sm text-[var(--text-secondary)] whitespace-pre-wrap animate-fade-in">
                    {task.description}
                </div>
            )}
        </div>
    );
};

export default TaskItem;