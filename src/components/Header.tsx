'use client';

import { useState } from 'react';

interface GoalsState {
  targetScore: number;
  examDate: string | null;
}

interface HeaderProps {
  goals: GoalsState;
  onUpdateGoals: (goals: GoalsState) => void;
}

export default function Header({ goals, onUpdateGoals }: HeaderProps) {
  const [targetScore, setTargetScore] = useState(goals.targetScore);
  const [examDate, setExamDate] = useState(goals.examDate);

  const handleUpdateGoals = () => {
    onUpdateGoals({
      targetScore,
      examDate,
    });
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg mb-5">
      <h1 className="text-3xl text-center text-black mb-5">📚 TOEIC Study Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <input
          type="number"
          value={targetScore}
          onChange={(e) => setTargetScore(Number(e.target.value))}
          placeholder="目標スコア"
          className="p-3 border-2 border-black-200 rounded-lg text-base text-black"
        />
        <input
          type="date"
          value={examDate || ''}
          onChange={(e) => setExamDate(e.target.value)}
          className="p-3 border-2 border-black-200 rounded-lg text-base text-black"
        />
        <button
          onClick={handleUpdateGoals}
          className="bg-gradient-to-r from-blue-400 to-purple-600 text-white px-5 py-3 rounded-lg hover:translate-y-[-2px] transition-transform"
        >
          目標更新
        </button>
      </div>
    </div>
  );
}
