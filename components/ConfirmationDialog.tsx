import React from 'react';
import { useApp } from '../context/AppContext';

const ConfirmationDialog: React.FC = () => {
    const { confirmation, hideConfirmation } = useApp();

    if (!confirmation) {
        return null;
    }

    const { message, confirmText, onConfirm } = confirmation;

    const handleConfirm = () => {
        onConfirm();
        hideConfirmation();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity animate-fade-in" 
            onClick={hideConfirmation}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-sm p-6 animate-slide-up" 
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Confirmar Ação</h2>
                <p className="text-[var(--text-secondary)] mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={hideConfirmation} 
                        className="px-4 py-2 rounded-md bg-[var(--bg-tertiary)] hover:opacity-80 text-[var(--text-primary)] transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        onClick={handleConfirm} 
                        className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;