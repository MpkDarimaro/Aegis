import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudySession } from '../types';

const LogStudySessionModal: React.FC = () => {
    const { subjects, pendingStudySessionLog, clearStudySessionLogRequest } = useApp();
    
    const [isStudy, setIsStudy] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [questionsCorrect, setQuestionsCorrect] = useState('');
    const [questionsTotal, setQuestionsTotal] = useState('');

    if (!pendingStudySessionLog) return null;

    const { onLogComplete } = pendingStudySessionLog;

    const handleClose = (studyInfo?: Partial<StudySession>) => {
        onLogComplete(studyInfo);
        clearStudySessionLogRequest();
    };

    const handleSave = () => {
        const correct = parseInt(questionsCorrect);
        const total = parseInt(questionsTotal);
        
        handleClose({
            subjectId: selectedSubject,
            questionsCorrect: isNaN(correct) ? undefined : correct,
            questionsTotal: isNaN(total) ? undefined : total
        });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity animate-fade-in" onClick={() => handleClose()}>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-md p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-4">Sessão Concluída</h2>
                {!isStudy ? (
                    <div>
                        <p className="text-[var(--text-secondary)] mb-6">Esta foi uma sessão de estudos?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => handleClose()} className="px-4 py-2 rounded-md bg-[var(--bg-tertiary)] hover:opacity-80 text-[var(--text-primary)] transition-colors">Não</button>
                            <button onClick={() => setIsStudy(true)} disabled={subjects.length === 0} className="px-4 py-2 rounded-md bg-[var(--accent)] hover:opacity-90 text-[var(--accent-text)] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Sim
                            </button>
                        </div>
                         {subjects.length === 0 && <p className="text-xs text-center text-[var(--text-muted)] mt-4">Nenhuma matéria cadastrada. Adicione uma na aba 'Estudos'.</p>}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Matéria Estudada</label>
                            <select id="subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none">
                                <option value="" disabled>Selecione uma matéria</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <p className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Questões (Opcional)</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="correct" className="block text-xs text-[var(--text-muted)] mb-1">Acertos</label>
                                    <input type="number" id="correct" value={questionsCorrect} onChange={e => setQuestionsCorrect(e.target.value)} min="0" className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2" />
                                </div>
                                <div>
                                    <label htmlFor="total" className="block text-xs text-[var(--text-muted)] mb-1">Total</label>
                                    <input type="number" id="total" value={questionsTotal} onChange={e => setQuestionsTotal(e.target.value)} min="0" className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md px-3 py-2" />
                                </div>
                            </div>
                        </div>
                         <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => handleClose()} className="px-4 py-2 rounded-md bg-[var(--bg-tertiary)] hover:opacity-80 text-[var(--text-primary)] transition-colors">Pular</button>
                            <button onClick={handleSave} disabled={!selectedSubject} className="px-4 py-2 rounded-md bg-[var(--accent)] hover:opacity-90 text-[var(--accent-text)] font-semibold transition-colors disabled:opacity-50">Salvar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogStudySessionModal;
