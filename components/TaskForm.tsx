
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskType, RecurrenceType, Priority } from '../types';

interface TaskFormProps {
    taskToEdit?: Task | null;
    onClose: () => void;
}

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DURATION_PRESETS = [60, 120, 240, 360]; // 1h, 2h, 4h, 6h

const formatMinutesToHours = (minutes: number): string => {
    if (!minutes || minutes < 1) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    let result = '';
    if (h > 0) result += `${h}h`;
    if (m > 0) result += ` ${m}min`;
    return result.trim();
}

const TaskForm: React.FC<TaskFormProps> = ({ taskToEdit, onClose }) => {
    const { addTask, updateTask } = useApp();
    const [title, setTitle] = useState(taskToEdit?.title || '');
    const [description, setDescription] = useState(taskToEdit?.description || '');
    const [type, setType] = useState<TaskType>(taskToEdit?.type || TaskType.COMMON);
    const [priority, setPriority] = useState<Priority>(taskToEdit?.priority || Priority.MEDIUM);
    const [minDuration, setMinDuration] = useState(taskToEdit?.minDuration || 30);
    const [recurrence, setRecurrence] = useState<RecurrenceType>(taskToEdit?.recurrence || RecurrenceType.DAILY);
    const [specificDate, setSpecificDate] = useState(taskToEdit?.specificDate || new Date().toISOString().split('T')[0]);
    const [repeatDays, setRepeatDays] = useState<number[]>(taskToEdit?.repeatDays || []);
    const [error, setError] = useState('');
    
    const isImmutable = taskToEdit?.isImmutable || false;

    const handleDayToggle = (dayIndex: number) => {
        if (isImmutable) return;
        setError('');
        setRepeatDays(prev => 
            prev.includes(dayIndex) 
                ? prev.filter(d => d !== dayIndex) 
                : [...prev, dayIndex]
        );
    };

    const handleRecurrenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (isImmutable) return;
        setError('');
        setRecurrence(e.target.value as RecurrenceType);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('O título é obrigatório.');
            return;
        };

        if (recurrence === RecurrenceType.WEEKLY && repeatDays.length === 0) {
            setError('Selecione pelo menos um dia para a recorrência semanal.');
            return;
        }

        const taskData = {
            title,
            description: description.trim() || undefined,
            type,
            priority,
            recurrence,
            ...(type === TaskType.FOCUS && { minDuration: Number(minDuration) }),
            ...(recurrence === RecurrenceType.ONCE && { specificDate }),
            ...(recurrence === RecurrenceType.WEEKLY && { repeatDays }),
        };

        if (taskToEdit) {
            const finalData = isImmutable ? { ...taskToEdit, title, description: description.trim() || undefined } : { ...taskToEdit, ...taskData };
            updateTask(finalData);
        } else {
            addTask(taskData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4 transition-opacity animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-md p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-6">{taskToEdit ? 'Editar Missão' : 'Nova Missão'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Título</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                               className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none" required />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Descrição (Opcional)</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none min-h-[80px]"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Tipo</label>
                            <div className="grid grid-cols-2 gap-2">
                               <button type="button" onClick={() => !isImmutable && setType(TaskType.COMMON)} disabled={isImmutable} className={`p-2 rounded-md border text-sm transition-colors ${type === TaskType.COMMON ? 'bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)]' : 'bg-[var(--bg-quaternary)] border-[var(--border-color)]'} ${isImmutable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--bg-tertiary)]'}`}>Comum</button>
                               <button type="button" onClick={() => !isImmutable && setType(TaskType.FOCUS)} disabled={isImmutable} className={`p-2 rounded-md border text-sm transition-colors ${type === TaskType.FOCUS ? 'bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)]' : 'bg-[var(--bg-quaternary)] border-[var(--border-color)]'} ${isImmutable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--bg-tertiary)]'}`}>Foco</button>
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Prioridade</label>
                            <select value={priority} onChange={(e) => !isImmutable && setPriority(e.target.value as Priority)} disabled={isImmutable}
                                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none disabled:opacity-50 h-[42px]">
                                <option value={Priority.HIGH}>Alta</option>
                                <option value={Priority.MEDIUM}>Média</option>
                                <option value={Priority.LOW}>Baixa</option>
                            </select>
                        </div>
                    </div>
                    
                    {type === TaskType.FOCUS && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="duration" className="block text-sm font-medium text-[var(--text-secondary)]">Duração Mín. (minutos)</label>
                                <span className="text-sm font-bold text-[var(--accent)]">{formatMinutesToHours(Number(minDuration))}</span>
                            </div>
                           <input type="number" id="duration" value={minDuration} onChange={(e) => setMinDuration(parseInt(e.target.value))} min="1"
                                  disabled={isImmutable} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none disabled:opacity-50" />
                            <div className="flex gap-2 mt-2">
                                {DURATION_PRESETS.map(preset => (
                                    <button type="button" key={preset} onClick={() => !isImmutable && setMinDuration(preset)} disabled={isImmutable} className={`flex-1 py-1 px-2 text-xs bg-[var(--bg-quaternary)] border border-[var(--border-color)] rounded-md transition-colors ${isImmutable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--bg-tertiary)]'}`}>
                                        {formatMinutesToHours(preset)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Recorrência</label>
                        <select value={recurrence} onChange={handleRecurrenceChange} disabled={isImmutable}
                                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none disabled:opacity-50">
                            <option value={RecurrenceType.DAILY}>Diária</option>
                            <option value={RecurrenceType.WEEKLY}>Semanal</option>
                            <option value={RecurrenceType.ONCE}>Data Específica</option>
                        </select>
                    </div>

                    {recurrence === RecurrenceType.ONCE && (
                        <div>
                            <label htmlFor="specificDate" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Data</label>
                            <input type="date" id="specificDate" value={specificDate} onChange={(e) => !isImmutable && setSpecificDate(e.target.value)}
                                   disabled={isImmutable} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none disabled:opacity-50" />
                        </div>
                    )}

                    {recurrence === RecurrenceType.WEEKLY && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Repetir em</label>
                            <div className="flex justify-between gap-1">
                                {WEEK_DAYS.map((day, index) => (
                                    <button type="button" key={index} onClick={() => handleDayToggle(index)}
                                            disabled={isImmutable} className={`w-9 h-9 text-xs rounded-full border transition-colors ${repeatDays.includes(index) ? 'bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)]' : 'bg-[var(--bg-quaternary)] border-[var(--border-color)]'} ${isImmutable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--bg-tertiary)]'}`}>
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500 animate-fade-in">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-[var(--bg-tertiary)] hover:opacity-80 text-[var(--text-primary)] transition-colors">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-[var(--accent)] hover:opacity-90 text-[var(--accent-text)] font-semibold transition-colors">{taskToEdit ? 'Salvar Alterações' : 'Adicionar Tarefa'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;