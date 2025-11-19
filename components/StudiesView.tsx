import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import SubjectManagerModal from './SubjectManagerModal';
import { PlusIcon } from './icons/PlusIcon';
import { StarIcon } from './icons/StarIcon';
import { WarningIcon } from './icons/WarningIcon';
import { StudySession, Subject } from '../types';

const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const NegligenceAlert: React.FC<{ subject: Subject, lastStudied?: string }> = ({ subject, lastStudied }) => {
    const daysSinceStudied = lastStudied
        ? (new Date().getTime() - new Date(lastStudied).getTime()) / (1000 * 3600 * 24)
        : Infinity;

    const thresholds: { [key: number]: number } = {
        5: 4,  // 5 estrelas: 4 dias
        4: 6,  // 4 estrelas: 6 dias
        3: 8,  // 3 estrelas: 8 dias
        2: 14, // 2 estrelas: 14 dias
        1: 21, // 1 estrela: 21 dias
    };

    const threshold = thresholds[subject.importance] || 30;

    if (daysSinceStudied > threshold) {
        return (
            <div className="text-yellow-500" title={`Matéria importante não estudada há ${Math.floor(daysSinceStudied)} dias.`}>
                <WarningIcon />
            </div>
        );
    }
    return null;
}

const StudiesView: React.FC = () => {
    const { subjects, studySessions } = useApp();
    const [isManagerOpen, setIsManagerOpen] = useState(false);

    const subjectStats = useMemo(() => {
        const stats: { [key: string]: { totalSeconds: number, totalQuestions: number, correctQuestions: number, lastStudied?: string } } = {};
        
        subjects.forEach(s => {
            stats[s.id] = { totalSeconds: 0, totalQuestions: 0, correctQuestions: 0 };
        });

        studySessions.forEach(session => {
            if (stats[session.subjectId]) {
                stats[session.subjectId].totalSeconds += session.durationSeconds;
                stats[session.subjectId].totalQuestions += session.questionsTotal || 0;
                stats[session.subjectId].correctQuestions += session.questionsCorrect || 0;
                
                const currentLastStudied = stats[session.subjectId].lastStudied;
                if (!currentLastStudied || new Date(session.date) > new Date(currentLastStudied)) {
                    stats[session.subjectId].lastStudied = session.date;
                }
            }
        });

        return subjects.map(subject => {
            const subjectData = stats[subject.id];
            const accuracy = subjectData.totalQuestions > 0 ? (subjectData.correctQuestions / subjectData.totalQuestions) * 100 : 0;
            return {
                ...subject,
                ...subjectData,
                accuracy
            };
        }).sort((a, b) => b.totalSeconds - a.totalSeconds);

    }, [subjects, studySessions]);

    return (
        <>
            <div className="p-4 md:p-6 min-h-full">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">Painel de Estudos</h1>
                        <p className="text-[var(--text-secondary)]">Métricas de performance.</p>
                    </div>
                    <button
                        onClick={() => setIsManagerOpen(true)}
                        className="px-4 py-2 rounded-md bg-[var(--accent)] hover:opacity-90 text-[var(--accent-text)] font-semibold transition-colors text-sm flex items-center gap-2"
                    >
                        <PlusIcon />
                        <span>Gerenciar</span>
                    </button>
                </header>

                {subjectStats.length > 0 ? (
                    <div className="space-y-3">
                        {subjectStats.map(stat => (
                            <div key={stat.id} className="bg-[var(--bg-quaternary)]/50 rounded-lg border border-[var(--border-color)] p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-bold text-[var(--text-primary)]">{stat.name}</h2>
                                            <NegligenceAlert subject={stat} lastStudied={stat.lastStudied} />
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            {Array.from({length: 5}).map((_, i) => <StarIcon key={i} filled={i < stat.importance} size={14} />)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl font-display text-[var(--accent)]">{formatDuration(stat.totalSeconds)}</p>
                                        <p className="text-xs text-[var(--text-muted)]">Tempo Total</p>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-[var(--bg-tertiary)]/50 p-2 rounded-md">
                                        <p className="text-lg font-bold text-[var(--text-primary)]">{Math.round(stat.accuracy)}%</p>
                                        <p className="text-xs text-[var(--text-secondary)]">Acertos</p>
                                    </div>
                                    <div className="bg-[var(--bg-tertiary)]/50 p-2 rounded-md">
                                        <p className="text-lg font-bold text-[var(--text-primary)]">{stat.totalQuestions}</p>
                                        <p className="text-xs text-[var(--text-secondary)]">Questões</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-[var(--text-secondary)]">Nenhuma matéria cadastrada.</p>
                        <p className="text-[var(--text-muted)] text-sm">Clique em "Gerenciar" para adicionar sua primeira matéria.</p>
                    </div>
                )}
            </div>

            {isManagerOpen && <SubjectManagerModal onClose={() => setIsManagerOpen(false)} />}
        </>
    );
};

export default StudiesView;
