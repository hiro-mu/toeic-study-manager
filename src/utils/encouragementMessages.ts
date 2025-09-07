import type { EncouragementMessage, MessageContext } from '@/types';

/**
 * 励ましメッセージのデータベース
 * 様々なシチュエーションに対応したメッセージを提供
 */
export const ENCOURAGEMENT_MESSAGES: EncouragementMessage[] = [
  // 挨拶・開始時
  {
    id: 'greeting_001',
    text: '今日もTOEIC学習を始めましょう！継続は力なりです。',
    emoji: '🌟',
    category: 'greeting',
    context: ['morning']
  },
  {
    id: 'greeting_002',
    text: 'お疲れ様です！午後の学習タイムですね。集中していきましょう！',
    emoji: '☀️',
    category: 'greeting',
    context: ['afternoon']
  },
  {
    id: 'greeting_003',
    text: '夜の学習時間ですね。一日の締めくくりに頑張りましょう！',
    emoji: '🌙',
    category: 'greeting',
    context: ['evening']
  },

  // 進捗達成時
  {
    id: 'progress_001',
    text: '素晴らしい進捗です！目標スコアまでもう少しですね。',
    emoji: '🎯',
    category: 'progress',
    context: ['high_progress', 'near_goal']
  },
  {
    id: 'progress_002',
    text: '着実に力を付けています。この調子で続けていきましょう！',
    emoji: '📈',
    category: 'progress',
    context: ['high_progress']
  },
  {
    id: 'progress_003',
    text: '今日も学習を継続できました。毎日の積み重ねが大きな成果に繋がります。',
    emoji: '🔥',
    category: 'progress',
    context: ['streak']
  },

  // モチベーション向上
  {
    id: 'motivation_001',
    text: 'TOEICスコアアップは一日にしてならず。今日の努力が明日の成果になります！',
    emoji: '💪',
    category: 'motivation',
    context: ['low_progress']
  },
  {
    id: 'motivation_002',
    text: '難しく感じても大丈夫。挑戦することで成長できます！',
    emoji: '🚀',
    category: 'motivation',
    context: ['low_progress']
  },
  {
    id: 'motivation_003',
    text: '学習は投資です。今日の時間が将来の可能性を広げます。',
    emoji: '💎',
    category: 'motivation',
    context: []
  },

  // タスク完了時
  {
    id: 'completion_001',
    text: 'タスク完了おめでとうございます！一歩ずつ前進していますね。',
    emoji: '✅',
    category: 'completion',
    context: []
  },
  {
    id: 'completion_002',
    text: 'よくできました！今日の学習成果を実感していますか？',
    emoji: '🎉',
    category: 'completion',
    context: []
  },
  {
    id: 'completion_003',
    text: '素晴らしい集中力でした。この勢いを保ちましょう！',
    emoji: '⭐',
    category: 'completion',
    context: []
  },

  // 目標設定時
  {
    id: 'goal_001',
    text: '目標スコアを設定しましたね！明確な目標は成功への第一歩です。',
    emoji: '🎯',
    category: 'goal',
    context: []
  },
  {
    id: 'goal_002',
    text: '高い目標を掲げましたね。チャレンジ精神が素晴らしいです！',
    emoji: '🏆',
    category: 'goal',
    context: []
  },

  // 日常的な励まし
  {
    id: 'daily_001',
    text: '今日も学習に取り組む姿勢が立派です。継続は最大の武器です！',
    emoji: '📚',
    category: 'daily',
    context: []
  },
  {
    id: 'daily_002',
    text: '小さな努力も積み重ねれば大きな成果になります。頑張って！',
    emoji: '🌱',
    category: 'daily',
    context: []
  },
  {
    id: 'daily_003',
    text: '学習習慣が身についていますね。素晴らしい継続力です！',
    emoji: '💫',
    category: 'daily',
    context: ['streak']
  },

  // 挑戦・難しい時
  {
    id: 'challenge_001',
    text: '困難は成長のチャンス。今の頑張りが必ず報われます！',
    emoji: '🔥',
    category: 'challenge',
    context: ['low_progress']
  },
  {
    id: 'challenge_002',
    text: '諦めずに続けることが成功の秘訣です。応援しています！',
    emoji: '💪',
    category: 'challenge',
    context: ['low_progress']
  },
  {
    id: 'challenge_003',
    text: '今日の学習が明日の自信に繋がります。一歩ずつ進みましょう！',
    emoji: '🌟',
    category: 'challenge',
    context: []
  }
];

/**
 * 現在の状況に適したメッセージコンテキストを判定
 */
export function getCurrentContext(options: {
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  hasGoal: boolean;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}): MessageContext[] {
  const { completionRate, completedTasks, hasGoal, timeOfDay } = options;
  const contexts: MessageContext[] = [];

  // 時間帯
  if (timeOfDay) {
    contexts.push(timeOfDay);
  }

  // 進捗率による判定
  if (completionRate >= 80) {
    contexts.push('high_progress');
  } else if (completionRate <= 30) {
    contexts.push('low_progress');
  }

  // 初回タスク
  if (completedTasks === 1) {
    contexts.push('first_task');
  }

  // 連続学習（例: 3日以上継続）
  if (completedTasks >= 3) {
    contexts.push('streak');
  }

  // 目標に近い（90%以上）
  if (hasGoal && completionRate >= 90) {
    contexts.push('near_goal');
  }

  return contexts;
}

/**
 * 時間帯を取得
 */
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

/**
 * コンテキストに適したメッセージをランダムに選択
 */
export function getRandomEncouragementMessage(
  contexts: MessageContext[] = [],
  excludeRecentIds: string[] = []
): EncouragementMessage {
  // コンテキストに適合するメッセージをフィルタリング
  let filteredMessages = ENCOURAGEMENT_MESSAGES.filter(message => {
    // 最近表示されたメッセージを除外
    if (excludeRecentIds.includes(message.id)) {
      return false;
    }

    // コンテキストが指定されていない場合、すべてのメッセージが対象
    if (contexts.length === 0) {
      return true;
    }

    // メッセージのコンテキストが空の場合、汎用メッセージとして使用
    if (message.context.length === 0) {
      return true;
    }

    // コンテキストが一致するかチェック
    return message.context.some(ctx => contexts.includes(ctx));
  });

  // 適合するメッセージがない場合、汎用メッセージを使用
  if (filteredMessages.length === 0) {
    filteredMessages = ENCOURAGEMENT_MESSAGES.filter(
      message => message.context.length === 0 && !excludeRecentIds.includes(message.id)
    );
  }

  // それでもない場合、全メッセージから選択
  if (filteredMessages.length === 0) {
    filteredMessages = ENCOURAGEMENT_MESSAGES.filter(
      message => !excludeRecentIds.includes(message.id)
    );
  }

  // 最終的に選択肢がない場合、最初のメッセージを返す
  if (filteredMessages.length === 0) {
    return ENCOURAGEMENT_MESSAGES[0];
  }

  // ランダムに選択
  const randomIndex = Math.floor(Math.random() * filteredMessages.length);
  return filteredMessages[randomIndex];
}

/**
 * 表示履歴の管理（LocalStorage使用）
 */
export class MessageHistoryManager {
  private static readonly STORAGE_KEY = 'encouragement_message_history';
  private static readonly MAX_HISTORY = 10; // 最大履歴数

  static getRecentIds(): string[] {
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  static addToHistory(messageId: string): void {
    try {
      const history = this.getRecentIds();
      const updatedHistory = [messageId, ...history.filter(id => id !== messageId)]
        .slice(0, this.MAX_HISTORY);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.warn('Failed to update message history:', error);
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear message history:', error);
    }
  }
}

/**
 * メインの励ましメッセージ取得関数
 */
export function getEncouragementMessage(options: {
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  hasGoal: boolean;
}): EncouragementMessage {
  const timeOfDay = getTimeOfDay();
  const contexts = getCurrentContext({ ...options, timeOfDay });
  const recentIds = MessageHistoryManager.getRecentIds();

  const message = getRandomEncouragementMessage(contexts, recentIds);
  MessageHistoryManager.addToHistory(message.id);

  return message;
}
