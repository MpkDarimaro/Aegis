export enum TaskType {
  COMMON = 'COMMON',
  FOCUS = 'FOCUS',
}

export enum RecurrenceType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  ONCE = 'ONCE',
}

export enum Priority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  recurrence: RecurrenceType;
  repeatDays?: number[]; // 0 (Sun) to 6 (Sat)
  specificDate?: string; // 'YYYY-MM-DD'
  minDuration?: number; // in minutes for FOCUS tasks
  createdAt: number; // timestamp
  isImmutable?: boolean; // Se for true, a tarefa não pode ser "desconcluída" e a maioria dos campos não pode ser editada.
  priority: Priority;
}

export interface TaskCompletion {
    [taskId: string]: {
        [date: string]: boolean; // date is 'YYYY-MM-DD'
    }
}

export interface FocusSession {
    [date: string]: number; // date is 'YYYY-MM-DD', value is total seconds
}

export interface Subject {
    id: string;
    name: string;
    createdAt: number;
    importance: number; // 1 to 5 stars
}

export interface StudySession {
    id: string;
    subjectId: string;
    date: string; // 'YYYY-MM-DD'
    durationSeconds: number;
    questionsCorrect?: number;
    questionsTotal?: number;
}

export interface QuoteState {
    index: number;
    nextUpdate: number; // timestamp for next auto-update
}

export interface QuickFocusState {
    time: number; // seconds elapsed
    isActive: boolean;
}

export interface LogEntry {
    timestamp: number;
    message: string;
    data?: string;
}

export enum AchievementID {
    // Task Completion
    FIRST_TASK = 'FIRST_TASK',
    TASK_MASTER_BRONZE = 'TASK_MASTER_BRONZE',
    TASK_MASTER_SILVER = 'TASK_MASTER_SILVER',
    TASK_MASTER_GOLD = 'TASK_MASTER_GOLD',

    // Focus
    FIRST_FOCUS_TASK = 'FIRST_FOCUS_TASK',
    FOCUS_10_HOURS = 'FOCUS_10_HOURS',
    FOCUS_100_HOURS = 'FOCUS_100_HOURS',
    MARATHONER_BRONZE = 'MARATHONER_BRONZE',

    // Streaks & Consistency
    STREAK_3_DAYS = 'STREAK_3_DAYS',
    STREAK_7_DAYS = 'STREAK_7_DAYS',
    STREAK_30_DAYS = 'STREAK_30_DAYS',
    PERFECTIONIST_BRONZE = 'PERFECTIONIST_BRONZE',
    WEEKEND_WARRIOR_BRONZE = 'WEEKEND_WARRIOR_BRONZE',
    WEEKLY_WARRIOR_SILVER = 'WEEKLY_WARRIOR_SILVER',
    PERFECT_MONTH_GOLD = 'PERFECT_MONTH_GOLD',
    
    // Study achievements
    FIRST_STUDY_SESSION = 'FIRST_STUDY_SESSION',
    SUBJECT_CREATOR_BRONZE = 'SUBJECT_CREATOR_BRONZE',
    STUDY_50_HOURS = 'STUDY_50_HOURS',
    SUBJECT_SPECIALIST_SILVER = 'SUBJECT_SPECIALIST_SILVER',
    PROBLEM_SOLVER_SILVER = 'PROBLEM_SOLVER_SILVER',
    ACADEMIC_ACCURACY_GOLD = 'ACADEMIC_ACCURACY_GOLD',

    // Meta
    AEGIS_LEGEND_GOLD = 'AEGIS_LEGEND_GOLD'
}

export type AchievementTier = 'Bronze' | 'Silver' | 'Gold';

export interface Achievement {
    id: AchievementID;
    name: string;
    description: string;
    tier: AchievementTier;
    iconName: string;
    condition: (context: any) => boolean;
}
