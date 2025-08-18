'use client';

interface GoalsState {
  targetScore: number;
  examDate: string | null;
}

interface HeaderProps {
  goals: GoalsState;
  onUpdateGoals: (goals: GoalsState) => void;
}

export default function Header({ goals, onUpdateGoals }: HeaderProps) {
  const handleTargetScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateGoals({
      ...goals,
      targetScore: Number(e.target.value)
    });
  };

  const handleExamDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateGoals({
      ...goals,
      examDate: e.target.value || null
    });
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg mb-5">
      <h1 className="text-3xl text-center text-black mb-5">📚 TOEIC Study Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div>
          <label htmlFor="targetScore" className="block text-sm font-medium text-gray-700 mb-1">
            目標スコア
          </label>
          <input
            id="targetScore"
            type="number"
            value={goals.targetScore}
            onChange={handleTargetScoreChange}
            placeholder="目標スコアを入力"
            className="p-3 border-2 border-black-200 rounded-lg text-base text-black w-full"
            step="10"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-1">
            試験日
          </label>
          <input
            id="examDate"
            type="date"
            value={goals.examDate || ''}
            onChange={handleExamDateChange}
            className="p-3 border-2 border-black-200 rounded-lg text-base text-black w-full"
          />
        </div>
      </div>
    </div>
  );
}