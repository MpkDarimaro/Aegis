import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '../types';

interface TaskListProps {
    tasks: Task[];
    date: Date;
    onEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, date, onEdit }) => {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-[var(--text-secondary)]">Nenhuma missão para hoje.</p>
                <p className="text-[var(--text-muted)] text-sm">Adicione uma tarefa para começar.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} date={date} onEdit={onEdit} />
            ))}
        </div>
    );
};

export default TaskList;