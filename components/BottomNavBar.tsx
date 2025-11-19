import React from 'react';
import { useApp } from '../context/AppContext';
import { HomeIcon } from './icons/HomeIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface NavButtonProps {
  view: string;
  label: string;
  icon: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ view, label, icon }) => {
    const { currentView, setCurrentView } = useApp();
    const isActive = currentView === view;

    return (
        <button onClick={() => setCurrentView(view)} className={`flex flex-col items-center justify-center w-1/5 h-full transition-colors duration-200 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};

const BottomNavBar: React.FC = () => {
  const { openTaskForm } = useApp();

  const handleAddTask = () => {
    openTaskForm(null); // Passa null para indicar que é uma nova tarefa
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40" style={{ paddingBottom: 'var(--sab)' }}>
      <div className="w-full h-full max-w-md mx-auto">
        <div className="absolute left-1/2 bottom-8 -translate-x-1/2 z-20">
          <button
            onClick={handleAddTask}
            className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900"
            aria-label="Adicionar nova tarefa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[var(--bg-secondary)]" style={{
          clipPath: 'path("M0,10 C0,0 10,0 20,0 H calc(50% - 40px) C calc(50% - 20px),0 calc(50% - 25px),10 calc(50% - 15px),20 L calc(50% + 15px),20 C calc(50% + 25px),10 calc(50% + 20px),0 calc(50% + 40px),0 H calc(100% - 20px) C calc(100% - 10px),0 100%,0 100%,10 V 100 H 0 V 10 Z")'
        }}>
          <nav className="flex justify-around items-center h-full text-[var(--text-secondary)]">
            <NavButton view="dashboard" label="Hoje" icon={<HomeIcon className="w-6 h-6" />} />
            <NavButton view="agenda" label="Agenda" icon={<CalendarIcon className="w-6 h-6" />} />
            <NavButton view="studies" label="Estudos" icon={<BookOpenIcon className="w-6 h-6" />} />

            <div className="w-1/6"></div>

            <NavButton view="progress" label="Progresso" icon={<ChartBarIcon className="w-6 h-6" />} />
            <NavButton view="inspiration" label="Inspirar" icon={<LightbulbIcon className="w-6 h-6" />} />
            <NavButton view="settings" label="Ajustes" icon={<SettingsIcon className="w-6 h-6" />} />
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default BottomNavBar;