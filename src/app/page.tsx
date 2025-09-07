'use client';

import Calendar from '@/components/Calendar';
import EncouragementToast, { useEncouragementToast } from '@/components/EncouragementToast';
import Header from '@/components/Header';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { useAuth } from '@/hooks/useAuth';
import { FirestoreService } from '@/lib/dataService';
import type { Goal, Task, TaskCategory } from '@/types';
import { getEncouragementMessage } from '@/utils/encouragementMessages';
import { calculateCategoryStats } from '@/utils/statistics';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [uncompletedTasks, setUncompletedTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal | null>(null);

  const { user, loading, error: authError } = useAuth();
  const router = useRouter();

  // 励ましメッセージ機能
  const { currentMessage, showMessage, hideMessage } = useEncouragementToast();

  // 統計計算（他の関数からも使用するため、先頭で定義）
  const calculateStats = () => {
    const totalTasks = uncompletedTasks.length + completedTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    // カテゴリ別統計をユーティリティ関数で計算
    const allTasks = [...uncompletedTasks, ...completedTasks];
    const categoryStats = calculateCategoryStats(allTasks);

    return { totalTasks, completionRate, categoryStats };
  };

  // 未認証ユーザーのリダイレクト
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signin');
    }
  }, [user, loading, router]);

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

      // タスクリストを更新
      const [tasks, completedTasksData] = await Promise.all([
        FirestoreService.getTasks(user.uid),
        FirestoreService.getCompletedTasks(user.uid)
      ]);

      setUncompletedTasks(tasks);
      setCompletedTasks(completedTasksData);

      // タスク完了時の励ましメッセージを表示
      const stats = calculateStats();
      const encouragementMessage = getEncouragementMessage({
        completionRate: stats.completionRate,
        totalTasks: stats.totalTasks,
        completedTasks: completedTasksData.length,
        hasGoal: !!goals?.targetScore
      });

      showMessage(encouragementMessage);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      await FirestoreService.deleteTask(user.uid, taskId);

      // タスクリストを更新
      const [tasks, completedTasksData] = await Promise.all([
        FirestoreService.getTasks(user.uid),
        FirestoreService.getCompletedTasks(user.uid)
      ]);

      setUncompletedTasks(tasks);
      setCompletedTasks(completedTasksData);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleEditTask = async (taskId: string, updatedTask: {
    title: string;
    category: TaskCategory;
    description: string;
    dueDate: string;
  }) => {
    if (!user) return;

    try {
      await FirestoreService.updateTask(user.uid, taskId, updatedTask);

      // タスクリストを更新
      const tasks = await FirestoreService.getTasks(user.uid);
      setUncompletedTasks(tasks);
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  };

  // 認証が必要な場合のローディング画面
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
            <h3 className="text-lg font-bold text-primary mb-2">📅 残りタスク</h3>
            <div className="text-3xl font-bold text-orange-500">{uncompletedTasks.length}</div>
            <div className="text-sm text-secondary">今日: {
              uncompletedTasks.filter(task => task.dueDate === new Date().toISOString().split('T')[0]).length
            }</div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 進捗可視化セクション - モバイルで優先表示 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg lg:order-2">
            <h2 className="text-xl font-bold mb-4 text-primary">📊進捗可視化</h2>
            <Calendar
              tasks={[...uncompletedTasks, ...completedTasks]}
              currentDate={new Date()}
              goals={goals}
              onCompleteTask={handleCompleteTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          {/* タスク管理セクション */}
          <div className="bg-white rounded-2xl p-6 shadow-lg lg:order-1">
            <h2 className="text-xl font-bold mb-4 text-primary">📝タスク管理</h2>
            <TaskForm
              onAddTask={handleAddTask}
              onAddBulkTasks={handleAddBulkTasks}
            />
            <div className="mt-6">
              <TaskList
                tasks={uncompletedTasks}
                onCompleteTask={handleCompleteTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
              />
            </div>
          </div>
        </div>

        {/* カテゴリ別進捗 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-primary">📈 カテゴリ別進捗</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.categoryStats.map(({ category, completed, total, percentage }) => (
              <div key={category} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium capitalize text-primary">{category}</span>
                  <span className="text-sm text-secondary">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-secondary mt-1">
                  {completed} / {total} 完了
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 開発者情報 */}
        <div className="text-center text-white/70 text-sm">
          <p>TOEIC学習管理アプリ - Firebase + Next.js</p>
          <p>ユーザーID: {user?.uid}</p>
        </div>
      </div>

      {/* 励ましメッセージトースト */}
      <EncouragementToast
        message={currentMessage}
        onClose={hideMessage}
        position="top-right"
        autoHideDuration={5000}
      />
    </div>
  );
}
