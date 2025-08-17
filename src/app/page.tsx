'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import type { Task } from '@/components/CompletionModal';
import Calendar from '@/components/Calendar';

export default function Home() {
  const [uncompletedTasks, setUncompletedTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  interface GoalsState {
    targetScore: number;
    examDate: string | null;
  }

  const [goals, setGoals] = useState<GoalsState>({
    targetScore: 0,
    examDate: null,
  });

  useEffect(() => {
    // ローカルストレージからデータを読み込む
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('toeicTasks');
      const savedCompletedTasks = localStorage.getItem('toeicCompletedTasks');
      const savedGoals = localStorage.getItem('toeicGoals');
      if (savedTasks) setUncompletedTasks(JSON.parse(savedTasks));
      if (savedCompletedTasks) setCompletedTasks(JSON.parse(savedCompletedTasks));
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        // examDateがnullでない場合、ISO形式の日付文字列（YYYY-MM-DD）に変換
        let formattedExamDate = null;
        if (parsedGoals.examDate) {
          const date = new Date(parsedGoals.examDate);
          formattedExamDate = date.toISOString().split('T')[0];
        }
        setGoals({
          ...parsedGoals,
          examDate: formattedExamDate
        });
      }
    }
  }, []);

  const handleUpdateGoals = (newGoals: GoalsState) => {
    setGoals(newGoals);
    localStorage.setItem('toeicGoals', JSON.stringify(newGoals));
  };

  const handleCompleteTask = (taskId: number, completionData: { time: number; difficulty: string; focus: string }) => {
    const taskIndex = uncompletedTasks.findIndex((t: Task) => t.id === taskId);
    if (taskIndex === -1) return;

    const task = uncompletedTasks[taskIndex];
    const completedTask: Task = {
      ...task,
      completed: true,
      completedAt: new Date().toISOString(),
      completionData,
    };

    const newUncompletedTasks = [...uncompletedTasks];
    newUncompletedTasks.splice(taskIndex, 1);
    setUncompletedTasks(newUncompletedTasks);

    setCompletedTasks([...completedTasks, completedTask]);

    localStorage.setItem('toeicTasks', JSON.stringify(newUncompletedTasks));
    localStorage.setItem('toeicCompletedTasks', JSON.stringify([...completedTasks, completedTask]));
  };

  const handleDeleteTask = (taskId: number) => {
    const newUncompletedTasks = uncompletedTasks.filter((task: Task) => task.id !== taskId);
    setUncompletedTasks(newUncompletedTasks);
    localStorage.setItem('toeicTasks', JSON.stringify(newUncompletedTasks));
  };

  const calculateStats = () => {
    const totalTasks = uncompletedTasks.length + completedTasks.length;
    const completionRate = totalTasks > 0
      ? Math.round((completedTasks.length / totalTasks) * 100)
      : 0;

    const totalTime = completedTasks.reduce((sum, task) => {
      return sum + (task.completionData?.time || 0);
    }, 0);
    const totalHours = Math.round((totalTime / 60) * 10) / 10;

    let remainingDays = '-';
    let dailyTasksNeeded = '-';

    if (goals.examDate) {
      const today = new Date();
      const examDate = new Date(goals.examDate);
      const diffTime = examDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      remainingDays = daysLeft > 0 ? String(daysLeft) : '終了';
      dailyTasksNeeded = daysLeft > 0
        ? String(Math.ceil(uncompletedTasks.length / daysLeft))
        : String(uncompletedTasks.length);
    }

    return {
      completionRate,
      totalHours,
      remainingDays,
      dailyTasksNeeded,
    };
  };

  const stats = calculateStats();

  return (
    <main className="container mx-auto px-4 py-5">
      <Header goals={goals} onUpdateGoals={handleUpdateGoals} />

      <div className="bg-white p-5 rounded-2xl shadow-lg mb-5">
        <h3 className="text-xl font-bold mb-3 text-black">学習進捗</h3>
        <div className="h-5 bg-black-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-600 transition-all"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          <div className="bg-black-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
            <div className="text-sm text-black">完了率</div>
          </div>
          <div className="bg-black-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalHours}h</div>
            <div className="text-sm text-black">総学習時間</div>
          </div>
          <div className="bg-black-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.remainingDays}</div>
            <div className="text-sm text-black">残り日数</div>
          </div>
          <div className="bg-black-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.dailyTasksNeeded}</div>
            <div className="text-sm text-black">1日必要タスク</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-black">📝 タスク管理</h2>
          <TaskForm onAddTask={(taskData) => {
            const newTask: Task = {
              id: Date.now(),
              ...taskData,
              completed: false,
              createdAt: new Date().toISOString(),
            };
            setUncompletedTasks([...uncompletedTasks, newTask]);
            localStorage.setItem('toeicTasks', JSON.stringify([...uncompletedTasks, newTask]));
          }} 
          onAddBulkTasks={(tasksData) => {
            const newTasks: Task[] = tasksData.map((taskData, index) => ({
              id: Date.now() + index,
              ...taskData,
              completed: false,
              createdAt: new Date().toISOString(),
            }));
            const updatedTasks = [...uncompletedTasks, ...newTasks];
            setUncompletedTasks(updatedTasks);
            localStorage.setItem('toeicTasks', JSON.stringify(updatedTasks));
          }} />
          <TaskList
            tasks={uncompletedTasks}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-black">📊 進捗可視化</h2>
          <Calendar 
            tasks={[...uncompletedTasks, ...completedTasks]} 
            currentDate={new Date()} 
            goals={goals}
          />
        </div>
      </div>
    </main>
  );
}
