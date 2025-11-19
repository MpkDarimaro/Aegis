import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface LogViewerModalProps {
    onClose: () => void;
}

const LogViewerModal: React.FC<LogViewerModalProps> = ({ onClose }) => {
    const { logs } = useApp();
    const [copyButtonText, setCopyButtonText] = useState('Copiar Logs');

    const handleCopy = () => {
        const logText = logs
            .map(log => 
                `[${new Date(log.timestamp).toLocaleString('pt-BR')}] - ${log.message}\n${log.data ? `Data: ${log.data}\n` : ''}`
            )
            .join('-------------------\n');

        navigator.clipboard.writeText(logText).then(() => {
            setCopyButtonText('Copiado!');
            setTimeout(() => setCopyButtonText('Copiar Logs'), 2000);
        }).catch(err => {
            console.error('Failed to copy logs: ', err);
            setCopyButtonText('Falha ao copiar');
            setTimeout(() => setCopyButtonText('Copiar Logs'), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-lg p-6 flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold font-display text-[var(--text-primary)]">Logs do Aplicativo</h2>
                     <button onClick={onClose} className="text-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]">&times;</button>
                </div>
               
                <div className="flex-1 bg-[var(--bg-primary)] p-3 rounded-lg overflow-y-auto mb-4 scrollbar-hide">
                    {logs.length > 0 ? (
                        [...logs].reverse().map((log, index) => (
                            <div key={index} className="p-2 border-b border-[var(--border-color)] last:border-b-0">
                                <p className="text-xs text-[var(--accent)] font-mono">{new Date(log.timestamp).toLocaleString('pt-BR')}</p>
                                <p className="text-sm text-[var(--text-secondary)] font-semibold">{log.message}</p>
                                {log.data && (
                                    <pre className="mt-1 text-xs text-[var(--text-muted)] bg-black/30 p-2 rounded-md overflow-x-auto">
                                        <code>{log.data}</code>
                                    </pre>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-[var(--text-muted)] p-8">Nenhum log encontrado.</p>
                    )}
                </div>
                
                <button 
                    onClick={handleCopy}
                    className="w-full px-4 py-2 rounded-md bg-[var(--accent)] hover:opacity-90 text-[var(--accent-text)] font-semibold transition-colors"
                >
                    {copyButtonText}
                </button>
            </div>
        </div>
    );
};

export default LogViewerModal;
