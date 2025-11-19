import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Subject } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import { StarIcon } from './icons/StarIcon';
import { RefreshIcon } from './icons/RefreshIcon';

interface SubjectManagerModalProps {
    onClose: () => void;
}

const SubjectForm: React.FC<{ subjectToEdit?: Subject | null, onDone: () => void }> = ({ subjectToEdit, onDone }) => {
    const { addSubject, updateSubject } = useApp();
    const [name, setName] = useState(subjectToEdit?.name || '');
    const [importance, setImportance] = useState(subjectToEdit?.importance || 3);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (subjectToEdit) {
            updateSubject({ ...subjectToEdit, name, importance });
        } else {
            addSubject({ name, importance });
        }
        onDone();
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-[var(--bg-quaternary)]/50 rounded-lg mt-4">
            <h3 className="font-bold mb-3 text-[var(--text-primary)]">{subjectToEdit ? 'Editar Matéria' : 'Adicionar Matéria'}</h3>
            <div className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nome da matéria"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none"
                    required
                />
                <div>
                     <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Importância</label>
                     <div className="flex items-center gap-2">
                        {Array.from({length: 5}).map((_, i) => (
                             <button type="button" key={i} onClick={() => setImportance(i + 1)}>
                                <StarIcon filled={i < importance} />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onDone} className="px-3 py-1 rounded-md bg-[var(--bg-tertiary)] text-sm">Cancelar</button>
                    <button type="submit" className="px-3 py-1 rounded-md bg-[var(--accent)] text-[var(--accent-text)] text-sm font-semibold">{subjectToEdit ? 'Salvar' : 'Adicionar'}</button>
                </div>
            </div>
        </form>
    );
};


const SubjectManagerModal: React.FC<SubjectManagerModalProps> = ({ onClose }) => {
    const { subjects, deleteSubject, resetSubject, showConfirmation } = useApp();
    const [isAdding, setIsAdding] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const handleDelete = (subject: Subject) => {
        showConfirmation({
            message: `Tem certeza que deseja excluir a matéria "${subject.name}"? Todas as sessões de estudo associadas também serão removidas.`,
            confirmText: "Excluir",
            onConfirm: () => deleteSubject(subject.id)
        });
    };

    const handleReset = (subject: Subject) => {
        showConfirmation({
            message: `Tem certeza que deseja resetar o progresso da matéria "${subject.name}"? Isso irá apagar todo o histórico de horas estudadas e questões feitas, mas a matéria em si não será excluída.`,
            confirmText: "Resetar",
            onConfirm: () => resetSubject(subject.id)
        });
    };
    
    const handleEdit = (subject: Subject) => {
        setIsAdding(false);
        setEditingSubject(subject);
    };

    const handleFormDone = () => {
        setIsAdding(false);
        setEditingSubject(null);
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 p-4 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-md p-6 flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold font-display text-[var(--text-primary)]">Gerenciar Matérias</h2>
                    <button onClick={onClose} className="text-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]">&times;</button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                    {subjects.map(subject => (
                        <div key={subject.id} className="bg-[var(--bg-tertiary)]/50 p-3 rounded-md flex justify-between items-center">
                            <div>
                                <span className="text-[var(--text-primary)] font-semibold">{subject.name}</span>
                                <div className="flex items-center gap-1 mt-1">
                                    {Array.from({length: subject.importance}).map((_, i) => <StarIcon key={i} filled size={12}/>)}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleReset(subject)} className="p-2 text-[var(--text-secondary)] hover:text-yellow-500"><RefreshIcon /></button>
                                <button onClick={() => handleEdit(subject)} className="p-2 text-[var(--text-secondary)] hover:text-white"><PencilIcon /></button>
                                <button onClick={() => handleDelete(subject)} className="p-2 text-[var(--text-secondary)] hover:text-red-500"><TrashIcon /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {isAdding || editingSubject ? (
                    <SubjectForm subjectToEdit={editingSubject} onDone={handleFormDone} />
                ) : (
                    <button onClick={() => setIsAdding(true)} className="w-full mt-4 py-2 rounded-md bg-[var(--accent)]/20 text-[var(--accent)] font-semibold hover:bg-[var(--accent)]/30">
                        Adicionar Nova Matéria
                    </button>
                )}
            </div>
        </div>
    );
};

export default SubjectManagerModal;
