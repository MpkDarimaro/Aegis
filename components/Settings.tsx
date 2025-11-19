import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LogViewerModal from './LogViewerModal';
import { saveBackup } from '../services/backup';

const themes = [
    { id: 'theme-default', name: 'Padrão Aegis' },
    { id: 'theme-onyx', name: 'Ônix' },
    { id: 'theme-crimson', name: 'Carmesim' },
];

const Settings: React.FC = () => {
    const { theme, setTheme, showConfirmation, restoreStateFromBackup, ...appState } = useApp();
    const [isLogViewerOpen, setIsLogViewerOpen] = useState(false);

    const handleBackup = async () => {
        const backupData = {
            tasks: appState.tasks,
            completions: appState.completions,
            focusProgress: appState.focusProgress,
            focusSessions: appState.focusSessions,
            unlockedAchievements: appState.unlockedAchievements,
            subjects: appState.subjects,
            studySessions: appState.studySessions,
        };
        await saveBackup(backupData);
        alert('Backup salvo com sucesso!');
    };

    const handleRestore = () => {
        showConfirmation({
            message: 'Tem certeza que deseja restaurar o backup? Todos os dados atuais não salvos em backup serão perdidos.',
            confirmText: 'Restaurar',
            onConfirm: async () => {
                const success = await restoreStateFromBackup();
                if (success) {
                    alert('Backup restaurado com sucesso!');
                }
            },
        });
    };

    return (
        <>
            <div className="p-4 md:p-6 min-h-full">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold font-display text-[var(--text-primary)]">Configurações</h1>
                    <p className="text-[var(--text-secondary)]">Personalize sua experiência.</p>
                </header>
                
                <div className="space-y-8">
                    <div>
                        <h2 className="text-xl font-bold font-display text-[var(--text-primary)] mb-4">Temas</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {themes.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`p-4 rounded-lg border-2 transition-colors text-left ${theme === t.id ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border-color)] hover:border-[var(--accent)]/50'}`}
                                >
                                    <span className="font-semibold text-[var(--text-primary)]">{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold font-display text-[var(--text-primary)] mb-4">Backup e Restauração</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button 
                                onClick={handleBackup}
                                className="p-4 rounded-lg border-2 border-[var(--border-color)] hover:border-[var(--accent)]/50 transition-colors text-left"
                            >
                                <span className="font-semibold text-[var(--text-primary)]">Fazer Backup</span>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">Salva seus dados em um arquivo local.</p>
                            </button>
                            <button 
                                onClick={handleRestore}
                                className="p-4 rounded-lg border-2 border-[var(--border-color)] hover:border-[var(--accent)]/50 transition-colors text-left"
                            >
                                <span className="font-semibold text-[var(--text-primary)]">Restaurar Backup</span>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">Carrega seus dados de um arquivo local.</p>
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-bold font-display text-[var(--text-primary)] mb-4">Diagnóstico</h2>
                         <button 
                            onClick={() => setIsLogViewerOpen(true)}
                            className="w-full text-left p-4 rounded-lg border-2 border-[var(--border-color)] hover:border-[var(--accent)]/50 transition-colors"
                        >
                            <span className="font-semibold text-[var(--text-primary)]">Ver Logs do Aplicativo</span>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">Útil para relatar bugs ou problemas.</p>
                        </button>
                    </div>
                </div>
            </div>
            {isLogViewerOpen && <LogViewerModal onClose={() => setIsLogViewerOpen(false)} />}
        </>
    );
};

export default Settings;