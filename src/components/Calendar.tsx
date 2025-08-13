'use client';

import { useState } from 'react';
import { Task } from '@/types';
import TaskModal from './TaskModal';

interface CalendarProps {
  tasks: Task[];
  currentDate: Date;
}

export default function Calendar({ tasks, currentDate }: CalendarProps) {
  const [displayDate, setDisplayDate] = useState(currentDate);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
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
  }; const renderCalendar = () => {
    const days = getDaysInMonth(displayDate);
    const firstDay = getFirstDayOfMonth(displayDate);
    const calendar = [];

    // 曜日の行
    calendar.push(
      <div key="weekdays" className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="text-center font-bold text-black">
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
      const hasTasks = tasksForDate.length > 0;
      const hasCompletedTasks = tasksForDate.some(task => task.completed);

      const hasUncompletedTasks = tasksForDate.some(task => !task.completed);

      let bgClass = '';
      if (hasUncompletedTasks && hasCompletedTasks) {
        bgClass = 'has-task has-completed-task relative overflow-hidden';
      } else if (hasUncompletedTasks) {
        bgClass = 'has-task bg-blue-200 hover:bg-blue-300';
      } else if (hasCompletedTasks) {
        bgClass = 'has-completed-task bg-green-200 hover:bg-green-300';
      }

      week.push(
        <div
          key={dateString}
          className={`p-2 text-center border border-black rounded-md text-black ${bgClass} ${(hasUncompletedTasks || hasCompletedTasks) ? 'cursor-pointer hover:opacity-80' : ''
            }`}
          style={hasUncompletedTasks && hasCompletedTasks ? {
            background: 'linear-gradient(to right, rgb(191 219 254) 50%, rgb(187 247 208) 50%)'
          } : undefined}
          onClick={() => {
            if (hasUncompletedTasks || hasCompletedTasks) {
              setSelectedDate(dateString);
            }
          }}
        >
          {day}
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
        <button onClick={prevMonth} className="px-4 py-2 rounded-md border border-black hover:bg-black-100 text-black">前の月</button>
        <h2 className="text-xl font-bold">{formatMonth(displayDate)}</h2>
        <button onClick={nextMonth} className="px-4 py-2 rounded-md border border-black hover:bg-black-100 text-black">次の月</button>
      </div>
      <div className="space-y-2">
        {renderCalendar()}
      </div>
      {selectedDate && (
        <TaskModal
          tasks={getTasksForDate(selectedDate)}
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
