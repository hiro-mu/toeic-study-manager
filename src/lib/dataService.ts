import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  Task, 
  Goal, 
  FirebaseTask, 
  FirebaseGoal, 
  CompletionData
} from '@/types';

// Utility functions for data conversion
export const convertTaskToFirebase = (task: Omit<Task, 'id'>, userId: string): Omit<FirebaseTask, 'id'> => ({
  title: task.title,
  category: task.category,
  description: task.description || '',
  dueDate: Timestamp.fromDate(new Date(task.dueDate)),
  completed: task.completed,
  createdAt: Timestamp.fromDate(new Date(task.createdAt)),
  completedAt: task.completedAt ? Timestamp.fromDate(new Date(task.completedAt)) : undefined,
  completionData: task.completionData,
  userId
});

export const convertFirebaseToTask = (firebaseTask: FirebaseTask): Task => ({
  id: parseInt(firebaseTask.id) || Date.now(), // Firestore ID to number conversion
  title: firebaseTask.title,
  category: firebaseTask.category,
  description: firebaseTask.description,
  dueDate: firebaseTask.dueDate.toDate().toISOString().split('T')[0],
  completed: firebaseTask.completed,
  createdAt: firebaseTask.createdAt.toDate().toISOString(),
  completedAt: firebaseTask.completedAt?.toDate().toISOString(),
  completionData: firebaseTask.completionData
});

export const convertGoalToFirebase = (goal: Goal, userId: string): Omit<FirebaseGoal, 'id'> => ({
  targetScore: goal.targetScore,
  examDate: goal.examDate ? Timestamp.fromDate(new Date(goal.examDate)) : null,
  userId,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
});

export const convertFirebaseToGoal = (firebaseGoal: FirebaseGoal): Goal => ({
  targetScore: firebaseGoal.targetScore,
  examDate: firebaseGoal.examDate?.toDate().toISOString().split('T')[0] || null
});

// Firestore Service Class
export class FirestoreService {
  // Task operations
  static async getTasks(userId: string): Promise<Task[]> {
    const tasksQuery = query(
      collection(db, `users/${userId}/tasks`),
      where('completed', '==', false),
      orderBy('dueDate', 'asc')
    );
    
    const snapshot = await getDocs(tasksQuery);
    return snapshot.docs.map(doc => {
      const data = doc.data() as Omit<FirebaseTask, 'id'>;
      return convertFirebaseToTask({ id: doc.id, ...data });
    });
  }

  static async getCompletedTasks(userId: string): Promise<Task[]> {
    const tasksQuery = query(
      collection(db, `users/${userId}/tasks`),
      where('completed', '==', true),
      orderBy('completedAt', 'desc')
    );
    
    const snapshot = await getDocs(tasksQuery);
    return snapshot.docs.map(doc => {
      const data = doc.data() as Omit<FirebaseTask, 'id'>;
      return convertFirebaseToTask({ id: doc.id, ...data });
    });
  }

  static async addTask(userId: string, taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>): Promise<string> {
    const task: Omit<Task, 'id'> = {
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const firebaseTask = convertTaskToFirebase(task, userId);
    const docRef = await addDoc(collection(db, `users/${userId}/tasks`), firebaseTask);
    return docRef.id;
  }

  static async updateTask(userId: string, taskId: string, updatedTask: Partial<Task>): Promise<void> {
    const taskRef = doc(db, `users/${userId}/tasks`, taskId);
    
    const updateData: Record<string, unknown> = {};
    if (updatedTask.title) updateData.title = updatedTask.title;
    if (updatedTask.category) updateData.category = updatedTask.category;
    if (updatedTask.description !== undefined) updateData.description = updatedTask.description;
    if (updatedTask.dueDate) updateData.dueDate = Timestamp.fromDate(new Date(updatedTask.dueDate));
    if (updatedTask.completed !== undefined) {
      updateData.completed = updatedTask.completed;
      if (updatedTask.completed && !updatedTask.completedAt) {
        updateData.completedAt = Timestamp.now();
      }
    }
    if (updatedTask.completionData) updateData.completionData = updatedTask.completionData;
    
    await updateDoc(taskRef, updateData);
  }

  static async deleteTask(userId: string, taskId: string): Promise<void> {
    const taskRef = doc(db, `users/${userId}/tasks`, taskId);
    await deleteDoc(taskRef);
  }

  static async completeTask(userId: string, taskId: string, completionData: CompletionData): Promise<void> {
    const taskRef = doc(db, `users/${userId}/tasks`, taskId);
    await updateDoc(taskRef, {
      completed: true,
      completedAt: Timestamp.now(),
      completionData
    });
  }

  // Goal operations
  static async getGoals(userId: string): Promise<Goal | null> {
    const snapshot = await getDocs(query(collection(db, `users/${userId}/profile`)));
    
    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs[0].data() as FirebaseGoal;
    return convertFirebaseToGoal(data);
  }

  static async saveGoals(userId: string, goals: Goal): Promise<void> {
    const goalsRef = doc(db, `users/${userId}/profile`, 'goals');
    const firebaseGoal = convertGoalToFirebase(goals, userId);
    await updateDoc(goalsRef, firebaseGoal);
  }

  // Real-time subscriptions
  static subscribeToTasks(userId: string, callback: (tasks: Task[]) => void): () => void {
    const tasksQuery = query(
      collection(db, `users/${userId}/tasks`),
      where('completed', '==', false),
      orderBy('dueDate', 'asc')
    );

    return onSnapshot(tasksQuery, (snapshot) => {
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data() as Omit<FirebaseTask, 'id'>;
        return convertFirebaseToTask({ id: doc.id, ...data });
      });
      callback(tasks);
    });
  }

  static subscribeToCompletedTasks(userId: string, callback: (tasks: Task[]) => void): () => void {
    const tasksQuery = query(
      collection(db, `users/${userId}/tasks`),
      where('completed', '==', true),
      orderBy('completedAt', 'desc')
    );

    return onSnapshot(tasksQuery, (snapshot) => {
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data() as Omit<FirebaseTask, 'id'>;
        return convertFirebaseToTask({ id: doc.id, ...data });
      });
      callback(tasks);
    });
  }
}
