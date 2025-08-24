'use client';

import Calendar from '@/components/Calendar';
import Header from '@/components/Header';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { useAuth } from '@/hooks/useAuth';
import { FirestoreService } from '@/lib/dataService';
import type { Goal, Task, TaskCategory } from '@/types';
import { calculateCategoryStats } from '@/utils/statistics';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [uncompletedTasks, setUncompletedTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal | null>(null);

  const { user, loading, error: authError } = useAuth();
  const router = useRouter();

  // 未認証ユーザーのリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signin');
    }
  }, [user, loading, router]);

  // 統計計算
  const calculateStats = () => {
    const totalTasks = uncompletedTasks.length + completedTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    // カテゴリ別統計をユーティリティ関数で計算
    const allTasks = [...uncompletedTasks, ...completedTasks];
    const categoryStats = calculateCategoryStats(allTasks);

    return { totalTasks, completionRate, categoryStats };
  };

  // Firebase認証後のデータ読み込み
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        // タスクとゴールを並行して読み込み
        const [tasks, completedTasksData, userGoals] = await Promise.all([
          FirestoreService.getTasks(user.uid),
          FirestoreService.getCompletedTasks(user.uid),
          FirestoreService.getGoals(user.uid)
        ]);

        setUncompletedTasks(tasks);
        setCompletedTasks(completedTasksData);
        setGoals(userGoals);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, [user]);

  // ローディング中の表示
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  // 未認証時の表示（リダイレクト前の一時表示）
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-primary mb-4">🔐 認証が必要です</h2>
          {authError && (
            <p className="text-red-600 mb-4">エラー: {authError}</p>
          )}
          <p className="text-secondary mb-6">
            TOEIC学習管理アプリを使用するには認証が必要です。
          </p>
          <div className="space-y-3">
            <Link
              href="/signin"
              className="block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="block bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              新規登録
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // タスク操作ハンドラー
  const handleAddTask = async (taskData: {
    title: string;
    category: TaskCategory;
    description: string;
    dueDate: string;
  }) => {
    if (!user) return;

    try {
      await FirestoreService.addTask(user.uid, taskData);
      // リアルタイム更新のため、再読み込み
      const tasks = await FirestoreService.getTasks(user.uid);
      setUncompletedTasks(tasks);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleAddBulkTasks = async (tasksData: Array<{
    title: string;
    category: TaskCategory;
    description: string;
    dueDate: string;
  }>) => {
    if (!user) return;

    try {
      // 並行して複数のタスクを追加
      await Promise.all(
        tasksData.map(taskData => FirestoreService.addTask(user.uid, taskData))
      );

      // 再読み込み
      const tasks = await FirestoreService.getTasks(user.uid);
      setUncompletedTasks(tasks);
    } catch (error) {
      console.error('Failed to add bulk tasks:', error);
    }
  };

  const handleCompleteTask = async (taskId: string, completionData: {
    time: number;
    difficulty: string;
    focus: string
  }) => {
    if (!user) return;

    try {
      await FirestoreService.completeTask(user.uid, taskId, completionData);

      // リアルタイム更新のため、両方のリストを再読み込み
      const [tasks, completedTasksData] = await Promise.all([
        FirestoreService.getTasks(user.uid),
        FirestoreService.getCompletedTasks(user.uid)
      ]);

      setUncompletedTasks(tasks);
      setCompletedTasks(completedTasksData);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      await FirestoreService.deleteTask(user.uid, taskId);

      // リアルタイム更新のため、再読み込み
      const tasks = await FirestoreService.getTasks(user.uid);
      setUncompletedTasks(tasks);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleEditTask = async (taskId: string, taskData: {
    title: string;
    category: TaskCategory;
    description: string;
    dueDate: string;
  }) => {
    if (!user) return;

    try {
      await FirestoreService.updateTask(user.uid, taskId, taskData);

      // リアルタイム更新のため、再読み込み
      const tasks = await FirestoreService.getTasks(user.uid);
      setUncompletedTasks(tasks);
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600">
      <Header
        completedTasks={completedTasks.length}
        totalTasks={uncompletedTasks.length + completedTasks.length}
        completionRate={stats.completionRate}
        goals={goals}
        onSaveGoals={async (newGoals) => {
          if (user) {
            try {
              await FirestoreService.saveGoals(user.uid, newGoals);
              setGoals(newGoals);
            } catch (error) {
              console.error('Failed to save goals:', error);
            }
          }
        }}
      />

      <div className="container mx-auto p-6 space-y-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-primary mb-2">📊 全体進捗</h3>
            <div className="text-3xl font-bold text-blue-600">{stats.completionRate}%</div>
            <div className="text-sm text-secondary">
              {completedTasks.length} / {stats.totalTasks} タスク完了
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-primary mb-2">🎯 今週の目標</h3>
            <div className="text-sm text-secondary">
              {goals?.targetScore ? `目標スコア: ${goals.targetScore}点` : '目標未設定'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-primary mb-2">📈 カテゴリ別進捗</h3>
            <div className="space-y-1">
              {Object.entries(stats.categoryStats).map(([category, { completed, total }]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-secondary capitalize">{category}</span>
                  <div className="text-xs text-secondary">
                    {completed} / {total} 完了
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* タスクフォーム */}
          <div className="lg:col-span-1">
            <TaskForm onAddTask={handleAddTask} onAddBulkTasks={handleAddBulkTasks} />
          </div>

          {/* タスクリスト */}
          <div className="lg:col-span-1">
            <TaskList
              tasks={uncompletedTasks}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          </div>

          {/* カレンダー */}
          <div className="lg:col-span-1">
            <Calendar
              tasks={uncompletedTasks}
              currentDate={new Date()}
              goals={goals}
              onCompleteTask={handleCompleteTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>

        {/* 開発者情報 */}
        <div className="text-center text-white/70 text-sm">
          <p>TOEIC学習管理アプリ - Firebase + Next.js</p>
          <p>ユーザーID: {user.uid}</p>
        </div>
      </div>
    </div>
  );
}
