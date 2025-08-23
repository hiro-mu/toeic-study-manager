'use client';

import { useState } from 'react';
import { Task, Goal } from '@/types';
import TaskModal from './TaskModal';

interface CalendarProps {
  tasks: Task[];
  currentDate: Date;
  goals?: Goal | null;
}

export default function Calendar({ tasks, currentDate, goals }: CalendarProps) {
  const [displayDate, setDisplayDate] = useState(currentDate);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    return dateString === todayString;
  };

  const formatMonth = (date: Date) => {
    return `${date.getMonth() + 1}月 ${date.getFullYear()}`;
  };

  const nextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const getTasksForDate = (date: string) => {
    // 日付文字列のフォーマットを YYYY-MM-DD の形式に統一
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return tasks.filter(task => task.dueDate === formattedDate);
  };

  const isExamDate = (dateString: string) => {
    return goals?.examDate === dateString;
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(displayDate);
    const firstDay = getFirstDayOfMonth(displayDate);
    const calendar = [];

    // 曜日の行
    calendar.push(
      <div key="weekdays" className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="text-center font-bold text-primary">
            {day}
          </div>
        ))}
      </div>
    );

    let week = [];
    // 空のセルを追加
    for (let i = 0; i < firstDay; i++) {
      week.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // 日付を追加
    for (let day = 1; day <= days; day++) {
      const date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateString = `${year}-${month}-${dayStr}`;
      const tasksForDate = getTasksForDate(dateString);
      const hasUncompletedTasks = tasksForDate.some(task => !task.completed);
      const hasCompletedTasks = tasksForDate.some(task => task.completed);
      const isExam = isExamDate(dateString);
      const isTodayDate = isToday(dateString);
      const taskCount = tasksForDate.length;

      let bgClass = '';
      let borderClass = '';
      let textClass = '';

      if (isExam) {
        bgClass = 'bg-red-500 text-white font-bold border-red-600 exam-date';
      } else if (hasUncompletedTasks && hasCompletedTasks) {
        bgClass = 'has-task has-completed-task relative overflow-hidden';
      } else if (hasUncompletedTasks) {
        bgClass = 'has-task bg-blue-200 hover:bg-blue-300';
      } else if (hasCompletedTasks) {
        bgClass = 'has-completed-task bg-green-200 hover:bg-green-300';
      }

      // 今日の日付の特別なスタイリング
      if (isTodayDate) {
        if (isExam) {
          borderClass = 'ring-4 ring-yellow-400 ring-opacity-75';
        } else {
          borderClass = 'ring-3 ring-blue-500 ring-opacity-75';
          if (!hasUncompletedTasks && !hasCompletedTasks) {
            bgClass = 'bg-blue-50 border-blue-300';
          }
        }
        textClass = 'font-bold';
      }

      week.push(
        <div
          key={dateString}
          className={`p-2 text-center border border-black rounded-md ${isExam ? 'text-white' : 'text-primary'} ${bgClass} ${borderClass} ${textClass} ${(hasUncompletedTasks || hasCompletedTasks || isExam) ? 'cursor-pointer hover:opacity-80' : ''
            } ${isTodayDate ? 'today-highlight' : ''}`}
          style={!isExam && hasUncompletedTasks && hasCompletedTasks ? {
            background: 'linear-gradient(to right, rgb(191 219 254) 50%, rgb(187 247 208) 50%)'
          } : undefined}
          onClick={() => {
            if (hasUncompletedTasks || hasCompletedTasks || isExam) {
              setSelectedDate(dateString);
            }
          }}
        >
          <div className="relative">
            {day}
            {/* 今日のマーカー */}
            {isTodayDate && !isExam && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
            )}
            {/* タスク数表示 */}
            {taskCount > 0 && !isExam && (
              <div className={`absolute -top-1 -right-1 flex flex-col items-center ${isTodayDate ? 'z-10' : ''}`}>
                {taskCount === 1 ? (
                  <div className={`w-2 h-2 ${isTodayDate ? 'bg-orange-500 ring-1 ring-orange-300' : 'bg-blue-500'} rounded-full border border-white`}></div>
                ) : taskCount <= 3 ? (
                  <div className="flex space-x-0.5">
                    {Array.from({ length: Math.min(taskCount, 3) }).map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 ${isTodayDate ? 'bg-orange-500 ring-1 ring-orange-300' : 'bg-blue-500'} rounded-full border border-white`}></div>
                    ))}
                  </div>
                ) : (
                  <div className={`${isTodayDate ? 'bg-orange-600 ring-2 ring-orange-300' : 'bg-red-500'} text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border border-white`}>
                    {taskCount > 9 ? '9+' : taskCount}
                  </div>
                )}
              </div>
            )}
            {isExam && (
              <div className={`absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white ${isTodayDate ? 'ring-2 ring-yellow-300' : ''}`}></div>
            )}
          </div>
        </div>
      );

      if ((day + firstDay) % 7 === 0) {
        calendar.push(
          <div key={`week-${day}`} className="grid grid-cols-7 gap-1">
            {week}
          </div>
        );
        week = [];
      }
    }

    // 残りの日を追加
    if (week.length > 0) {
      calendar.push(
        <div key="last-week" className="grid grid-cols-7 gap-1">
          {week}
        </div>
      );
    }

    return calendar;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-4 py-2 rounded-md border border-black hover:bg-black-100 text-primary">前の月</button>
        <h2 className="text-xl font-bold text-primary">{formatMonth(displayDate)}</h2>
        <button onClick={nextMonth} className="px-4 py-2 rounded-md border border-black hover:bg-black-100 text-primary">次の月</button>
      </div>
      <div className="space-y-2">
        {renderCalendar()}
      </div>

      {/* カレンダーの凡例 */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-50 border-2 border-blue-500 rounded mr-2 relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
          </div>
          <span className="text-primary font-semibold">今日</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-200 rounded mr-2"></div>
          <span className="text-primary">未完了タスク</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
          <span className="text-primary">完了済みタスク</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span className="text-primary">試験日</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-50 border-2 border-blue-500 rounded mr-2 relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-white"></div>
          </div>
          <span className="text-primary font-semibold">今日のタスク</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-primary">1タスク</span>
        </div>
        <div className="flex items-center">
          <div className="flex space-x-0.5 mr-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          </div>
          <span className="text-primary">2-3タスク</span>
        </div>
        <div className="flex items-center">
          <div className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold mr-2">4</div>
          <span className="text-primary">4+タスク</span>
        </div>
      </div>

      {selectedDate && (
        <>
          {isExamDate(selectedDate) ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    🎯 試験日: {new Date(selectedDate).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h2>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-gray-700 mb-4">TOEIC試験日です！</p>
                  <p className="text-sm text-gray-600">
                    目標スコア: {goals?.targetScore || '未設定'}点
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <TaskModal
              tasks={getTasksForDate(selectedDate)}
              date={selectedDate}
              onClose={() => setSelectedDate(null)}
            />
          )}
        </>
      )}
    </div>
  );
}