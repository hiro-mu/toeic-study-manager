export interface Task {
  id: number;
  title: string;
  category: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  completionData?: {
    time: number;
    difficulty: string;
    focus: string;
  };
}

export interface Goal {
  targetScore: number;
  examDate: string | null; // ISO format date string (YYYY-MM-DD) or null if not set
}

export interface CompletionData {
  studyTime: number;
  difficulty: number;
  focusLevel: number;
}
