import { Achievement, AchievementID, Task, TaskCompletion, TaskType, RecurrenceType, FocusSession, StudySession, Subject } from './types';

interface ConditionContext {
    tasks: Task[];
    completions: TaskCompletion;
    focusSessions: FocusSession;
    subjects: Subject[];
    studySessions: StudySession[];
    getTasksForDate: (date: Date) => Task[];
    getTaskStreak: (taskId: string, forDate: Date) => number;
    unlockedAchievements: AchievementID[];
}

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const getTotalCompletions = (completions: TaskCompletion): number => {
  let total = 0;
  Object.values(completions).forEach(taskCompletions => {
    Object.values(taskCompletions).forEach(isDone => {
      if (isDone) total++;
    });
  });
  return total;
};

const getTotalFocusSeconds = (focusSessions: FocusSession): number => {
    return Object.values(focusSessions).reduce((sum: number, seconds: number) => sum + (seconds || 0), 0);
};

export const ACHIEVEMENTS_LIST: Achievement[] = [
  // --- TAREFAS ---
  {
    id: AchievementID.FIRST_TASK,
    name: 'Iniciado',
    description: 'Conclua sua primeira missão.',
    tier: 'Bronze',
    iconName: 'star',
    condition: ({ completions }: ConditionContext): boolean => getTotalCompletions(completions) >= 1,
  },
  {
    id: AchievementID.TASK_MASTER_BRONZE,
    name: 'Mestre de Tarefas (Bronze)',
    description: 'Conclua um total de 50 missões.',
    tier: 'Bronze',
    iconName: 'shield',
    condition: ({ completions }: ConditionContext): boolean => getTotalCompletions(completions) >= 50,
  },
  {
    id: AchievementID.TASK_MASTER_SILVER,
    name: 'Mestre de Tarefas (Prata)',
    description: 'Conclua um total de 250 missões.',
    tier: 'Silver',
    iconName: 'shield',
    condition: ({ completions }: ConditionContext): boolean => getTotalCompletions(completions) >= 250,
  },
  {
    id: AchievementID.TASK_MASTER_GOLD,
    name: 'Mestre de Tarefas (Ouro)',
    description: 'Conclua um total de 1000 missões.',
    tier: 'Gold',
    iconName: 'shield',
    condition: ({ completions }: ConditionContext): boolean => getTotalCompletions(completions) >= 1000,
  },
  
  // --- FOCO ---
  {
    id: AchievementID.FIRST_FOCUS_TASK,
    name: 'Focado',
    description: 'Complete sua primeira tarefa de Foco.',
    tier: 'Bronze',
    iconName: 'clock',
    condition: ({ tasks, completions }: ConditionContext): boolean => {
      const focusTasks = tasks.filter((t: Task) => t.type === TaskType.FOCUS);
      return focusTasks.some((ft: Task) => 
        completions[ft.id] && Object.values(completions[ft.id]).some(isDone => isDone)
      );
    }
  },
  {
    id: AchievementID.MARATHONER_BRONZE,
    name: 'Maratonista',
    description: 'Complete uma sessão de foco de 2 horas ou mais.',
    tier: 'Bronze',
    iconName: 'bolt',
    condition: ({ focusSessions }: ConditionContext): boolean => {
      const twoHoursInSeconds = 2 * 3600;
      return Object.values(focusSessions).some(seconds => seconds >= twoHoursInSeconds);
    }
  },
  {
    id: AchievementID.FOCUS_10_HOURS,
    name: 'Estudante',
    description: 'Acumule 10 horas de foco total.',
    tier: 'Silver',
    iconName: 'book',
    condition: ({ focusSessions }: ConditionContext): boolean => getTotalFocusSeconds(focusSessions) >= 10 * 3600,
  },
  {
    id: AchievementID.FOCUS_100_HOURS,
    name: 'Mestre do Foco',
    description: 'Acumule 100 horas de foco total.',
    tier: 'Gold',
    iconName: 'brain',
    condition: ({ focusSessions }: ConditionContext): boolean => getTotalFocusSeconds(focusSessions) >= 100 * 3600,
  },

  // --- CONSISTÊNCIA ---
  {
    id: AchievementID.STREAK_3_DAYS,
    name: 'Em Ritmo',
    description: 'Mantenha uma sequência de 3 dias em qualquer tarefa.',
    tier: 'Bronze',
    iconName: 'flame',
    condition: ({ tasks, getTaskStreak }: ConditionContext): boolean => {
      const today = new Date();
      return tasks.some((t: Task) => (
        (t.recurrence === RecurrenceType.DAILY || t.recurrence === RecurrenceType.WEEKLY) &&
        getTaskStreak(t.id, today) >= 3
      ));
    }
  },
  {
    id: AchievementID.STREAK_7_DAYS,
    name: 'Persistente',
    description: 'Mantenha uma sequência de 7 dias em qualquer tarefa.',
    tier: 'Silver',
    iconName: 'flame',
    condition: ({ tasks, getTaskStreak }: ConditionContext): boolean => {
      const today = new Date();
      return tasks.some((t: Task) => (
        (t.recurrence === RecurrenceType.DAILY || t.recurrence === RecurrenceType.WEEKLY) &&
        getTaskStreak(t.id, today) >= 7
      ));
    }
  },
  {
    id: AchievementID.STREAK_30_DAYS,
    name: 'Vontade de Ferro',
    description: 'Mantenha uma sequência de 30 dias em qualquer tarefa.',
    tier: 'Gold',
    iconName: 'flame',
    condition: ({ tasks, getTaskStreak }: ConditionContext): boolean => {
      const today = new Date();
      return tasks.some((t: Task) => (
        (t.recurrence === RecurrenceType.DAILY || t.recurrence === RecurrenceType.WEEKLY) &&
        getTaskStreak(t.id, today) >= 30
      ));
    }
  },
  {
    id: AchievementID.PERFECTIONIST_BRONZE,
    name: 'Perfeccionista',
    description: 'Complete todas as missões de um dia.',
    tier: 'Bronze',
    iconName: 'checkmark',
    condition: ({ getTasksForDate, completions }: ConditionContext): boolean => {
      const today = new Date();
      const dateString = formatDate(today);
      const todaysTasks = getTasksForDate(today);
      if (todaysTasks.length === 0) return false;
      return todaysTasks.every(t => completions[t.id]?.[dateString]);
    }
  },
  {
    id: AchievementID.WEEKEND_WARRIOR_BRONZE,
    name: 'Guerreiro de Fim de Semana',
    description: 'Complete todas as tarefas de um Sábado e Domingo.',
    tier: 'Bronze',
    iconName: 'calendar',
    condition: ({ getTasksForDate, completions }: ConditionContext): boolean => {
        const checkDayIsPerfect = (date: Date): boolean => {
            const tasks = getTasksForDate(date);
            if (tasks.length === 0) return false;
            return tasks.every(t => completions[t.id]?.[formatDate(date)]);
        };

        const today = new Date();
        const mostRecentSunday = new Date(today);
        mostRecentSunday.setDate(today.getDate() - today.getDay());
        mostRecentSunday.setHours(0,0,0,0);

        const saturdayBefore = new Date(mostRecentSunday);
        saturdayBefore.setDate(mostRecentSunday.getDate() - 1);

        return checkDayIsPerfect(mostRecentSunday) && checkDayIsPerfect(saturdayBefore);
    }
  },
  {
    id: AchievementID.WEEKLY_WARRIOR_SILVER,
    name: 'Guerreiro da Semana',
    description: 'Complete todas as tarefas por 7 dias seguidos.',
    tier: 'Silver',
    iconName: 'calendar',
    condition: ({ getTasksForDate, completions }: ConditionContext): boolean => {
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const tasks = getTasksForDate(date);
            if (tasks.length === 0) return false;
            if (!tasks.every(t => completions[t.id]?.[formatDate(date)])) return false;
        }
        return true;
    }
  },
  {
    id: AchievementID.PERFECT_MONTH_GOLD,
    name: 'Mês Perfeito',
    description: 'Complete todas as tarefas por 30 dias seguidos.',
    tier: 'Gold',
    iconName: 'calendar',
    condition: ({ getTasksForDate, completions }: ConditionContext): boolean => {
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const tasks = getTasksForDate(date);
            if (tasks.length === 0) return false;
            if (!tasks.every(t => completions[t.id]?.[formatDate(date)])) return false;
        }
        return true;
    }
  },
  
  // --- ESTUDOS ---
  {
    id: AchievementID.FIRST_STUDY_SESSION,
    name: 'Estudante Dedicado',
    description: 'Registre sua primeira sessão de estudos.',
    tier: 'Bronze',
    iconName: 'book',
    condition: ({ studySessions }: ConditionContext): boolean => studySessions.length > 0,
  },
  {
    id: AchievementID.SUBJECT_CREATOR_BRONZE,
    name: 'Polímata',
    description: 'Crie 5 matérias de estudo diferentes.',
    tier: 'Bronze',
    iconName: 'brain',
    condition: ({ subjects }: ConditionContext): boolean => subjects.length >= 5,
  },
  {
    id: AchievementID.SUBJECT_SPECIALIST_SILVER,
    name: 'Especialista',
    description: 'Acumule 25 horas de estudo em uma única matéria.',
    tier: 'Silver',
    iconName: 'mountain',
    condition: ({ studySessions }: ConditionContext): boolean => {
      const secondsBySubject: { [key: string]: number } = {};
      studySessions.forEach(s => {
        secondsBySubject[s.subjectId] = (secondsBySubject[s.subjectId] || 0) + s.durationSeconds;
      });
      return Object.values(secondsBySubject).some(total => total >= 25 * 3600);
    },
  },
  {
    id: AchievementID.PROBLEM_SOLVER_SILVER,
    name: 'Resolvedor de Problemas',
    description: 'Responda um total de 500 questões.',
    tier: 'Silver',
    iconName: 'shield',
    condition: ({ studySessions }: ConditionContext): boolean => {
      return studySessions.reduce((sum, session) => sum + (session.questionsTotal || 0), 0) >= 500;
    }
  },
  {
    id: AchievementID.STUDY_50_HOURS,
    name: 'Mestre dos Estudos',
    description: 'Acumule 50 horas de estudo no total.',
    tier: 'Gold',
    iconName: 'brain',
    condition: ({ studySessions }: ConditionContext): boolean => {
      const totalStudySeconds = studySessions.reduce((sum, session) => sum + session.durationSeconds, 0);
      return totalStudySeconds >= 50 * 3600;
    }
  },
  {
    id: AchievementID.ACADEMIC_ACCURACY_GOLD,
    name: 'Precisão Acadêmica',
    description: 'Mantenha uma média de 90% de acertos em mais de 200 questões.',
    tier: 'Gold',
    iconName: 'target',
    condition: ({ studySessions }: ConditionContext): boolean => {
        const total = studySessions.reduce((acc, s) => ({
            correct: acc.correct + (s.questionsCorrect || 0),
            total: acc.total + (s.questionsTotal || 0)
        }), { correct: 0, total: 0 });
        if (total.total < 200) return false;
        return (total.correct / total.total) >= 0.9;
    }
  },
  
  // --- META ---
  {
    id: AchievementID.AEGIS_LEGEND_GOLD,
    name: 'Lenda do Aegis',
    description: 'Desbloqueie todas as outras conquistas.',
    tier: 'Gold',
    iconName: 'star',
    condition: ({ unlockedAchievements }: ConditionContext): boolean => {
        if (!unlockedAchievements) return false;
        const allOtherAchievements = ACHIEVEMENTS_LIST.filter(a => a.id !== AchievementID.AEGIS_LEGEND_GOLD);
        return allOtherAchievements.every(a => unlockedAchievements.includes(a.id));
    }
  }
];