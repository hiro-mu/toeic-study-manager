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
  examDate: string;
}

export interface CompletionData {
  studyTime: number;
  difficulty: number;
  focusLevel: number;
}
