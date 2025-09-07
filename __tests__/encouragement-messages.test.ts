import { 
  getEncouragementMessage, 
  getCurrentContext, 
  getTimeOfDay, 
  getRandomEncouragementMessage, 
  MessageHistoryManager,
  ENCOURAGEMENT_MESSAGES 
} from '@/utils/encouragementMessages';
import type { MessageContext } from '@/types';

// LocalStorage のモック
const localStorageMock: Storage = {
  storage: {} as Record<string, string>,
  getItem: jest.fn((key: string): string | null => localStorageMock.storage[key] || null),
  setItem: jest.fn((key: string, value: string): void => {
    localStorageMock.storage[key] = value;
  }),
  removeItem: jest.fn((key: string): void => {
    delete localStorageMock.storage[key];
  }),
  clear: jest.fn((): void => {
    localStorageMock.storage = {};
  }),
  key: jest.fn(),
  length: 0
};

// localStorageをモック
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('EncouragementMessages', () => {
  beforeEach(() => {
    // 各テストの前にlocalStorageをクリア
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('getTimeOfDay', () => {
    it('朝の時間帯を正しく判定する', () => {
      // 朝9時をモック
      jest.spyOn(Date.prototype, 'getHours').mockReturnValue(9);
      expect(getTimeOfDay()).toBe('morning');
    });

    it('午後の時間帯を正しく判定する', () => {
      // 午後3時をモック
      jest.spyOn(Date.prototype, 'getHours').mockReturnValue(15);
      expect(getTimeOfDay()).toBe('afternoon');
    });

    it('夜の時間帯を正しく判定する', () => {
      // 夜8時をモック
      jest.spyOn(Date.prototype, 'getHours').mockReturnValue(20);
      expect(getTimeOfDay()).toBe('evening');
    });
  });

  describe('getCurrentContext', () => {
    it('高い進捗率の場合、high_progressコンテキストを返す', () => {
      const contexts = getCurrentContext({
        completionRate: 85,
        totalTasks: 10,
        completedTasks: 8,
        hasGoal: true,
        timeOfDay: 'morning'
      });

      expect(contexts).toContain('high_progress');
      expect(contexts).toContain('morning');
    });

    it('低い進捗率の場合、low_progressコンテキストを返す', () => {
      const contexts = getCurrentContext({
        completionRate: 20,
        totalTasks: 10,
        completedTasks: 2,
        hasGoal: false,
        timeOfDay: 'afternoon'
      });

      expect(contexts).toContain('low_progress');
      expect(contexts).toContain('afternoon');
    });

    it('初回タスク完了の場合、first_taskコンテキストを返す', () => {
      const contexts = getCurrentContext({
        completionRate: 100,
        totalTasks: 1,
        completedTasks: 1,
        hasGoal: false
      });

      expect(contexts).toContain('first_task');
    });

    it('連続学習の場合、streakコンテキストを返す', () => {
      const contexts = getCurrentContext({
        completionRate: 60,
        totalTasks: 5,
        completedTasks: 3,
        hasGoal: false
      });

      expect(contexts).toContain('streak');
    });

    it('目標に近い場合、near_goalコンテキストを返す', () => {
      const contexts = getCurrentContext({
        completionRate: 95,
        totalTasks: 20,
        completedTasks: 19,
        hasGoal: true
      });

      expect(contexts).toContain('near_goal');
      expect(contexts).toContain('high_progress');
    });
  });

  describe('getRandomEncouragementMessage', () => {
    it('コンテキストなしでメッセージを取得できる', () => {
      const message = getRandomEncouragementMessage();
      expect(message).toBeDefined();
      expect(message.id).toBeDefined();
      expect(message.text).toBeDefined();
      expect(message.emoji).toBeDefined();
    });

    it('特定のコンテキストに適したメッセージを取得できる', () => {
      const contexts: MessageContext[] = ['morning', 'high_progress'];
      const message = getRandomEncouragementMessage(contexts);
      
      expect(message).toBeDefined();
      // メッセージのコンテキストが空か、指定されたコンテキストのいずれかを含む
      expect(
        message.context.length === 0 || 
        message.context.some(ctx => contexts.includes(ctx))
      ).toBe(true);
    });

    it('除外リストに含まれるメッセージは選択されない', () => {
      const excludeIds = ENCOURAGEMENT_MESSAGES.slice(0, 5).map(m => m.id);
      const message = getRandomEncouragementMessage([], excludeIds);
      
      expect(message).toBeDefined();
      expect(excludeIds).not.toContain(message.id);
    });
  });

  describe('MessageHistoryManager', () => {
    it('履歴を正しく保存・取得できる', () => {
      MessageHistoryManager.addToHistory('test_message_1');
      MessageHistoryManager.addToHistory('test_message_2');
      
      const history = MessageHistoryManager.getRecentIds();
      expect(history).toEqual(['test_message_2', 'test_message_1']);
    });

    it('重複するメッセージIDは重複排除される', () => {
      MessageHistoryManager.addToHistory('test_message_1');
      MessageHistoryManager.addToHistory('test_message_2');
      MessageHistoryManager.addToHistory('test_message_1'); // 重複
      
      const history = MessageHistoryManager.getRecentIds();
      expect(history).toEqual(['test_message_1', 'test_message_2']);
    });

    it('最大履歴数を超えた場合、古い履歴が削除される', () => {
      // 最大履歴数以上のメッセージを追加
      for (let i = 1; i <= 15; i++) {
        MessageHistoryManager.addToHistory(`test_message_${i}`);
      }
      
      const history = MessageHistoryManager.getRecentIds();
      expect(history.length).toBeLessThanOrEqual(10); // MAX_HISTORY = 10
      expect(history[0]).toBe('test_message_15'); // 最新が先頭
    });

    it('履歴をクリアできる', () => {
      MessageHistoryManager.addToHistory('test_message_1');
      MessageHistoryManager.clearHistory();
      
      const history = MessageHistoryManager.getRecentIds();
      expect(history).toEqual([]);
    });
  });

  describe('getEncouragementMessage', () => {
    it('統合テスト: 実際の使用シナリオでメッセージを取得できる', () => {
      const message = getEncouragementMessage({
        completionRate: 75,
        totalTasks: 8,
        completedTasks: 6,
        hasGoal: true
      });

      expect(message).toBeDefined();
      expect(message.id).toBeDefined();
      expect(message.text).toBeDefined();
      expect(message.emoji).toBeDefined();
      
      // メッセージが履歴に追加されていることを確認
      const history = MessageHistoryManager.getRecentIds();
      expect(history).toContain(message.id);
    });

    it('異なる状況で異なるコンテキストのメッセージが取得される', () => {
      // 高進捗のケース
      const highProgressMessage = getEncouragementMessage({
        completionRate: 90,
        totalTasks: 10,
        completedTasks: 9,
        hasGoal: true
      });

      // 低進捗のケース
      MessageHistoryManager.clearHistory(); // 履歴をクリア
      const lowProgressMessage = getEncouragementMessage({
        completionRate: 10,
        totalTasks: 10,
        completedTasks: 1,
        hasGoal: false
      });

      expect(highProgressMessage).toBeDefined();
      expect(lowProgressMessage).toBeDefined();
      
      // 異なるメッセージが選択される可能性が高い（完全に保証はできないがランダム性のテスト）
      // 少なくとも両方とも有効なメッセージであることを確認
      expect(ENCOURAGEMENT_MESSAGES.some(m => m.id === highProgressMessage.id)).toBe(true);
      expect(ENCOURAGEMENT_MESSAGES.some(m => m.id === lowProgressMessage.id)).toBe(true);
    });
  });

  describe('ENCOURAGEMENT_MESSAGES データの整合性', () => {
    it('すべてのメッセージに必要なプロパティが含まれている', () => {
      ENCOURAGEMENT_MESSAGES.forEach(message => {
        expect(message.id).toBeDefined();
        expect(typeof message.id).toBe('string');
        expect(message.text).toBeDefined();
        expect(typeof message.text).toBe('string');
        expect(message.emoji).toBeDefined();
        expect(typeof message.emoji).toBe('string');
        expect(message.category).toBeDefined();
        expect(Array.isArray(message.context)).toBe(true);
      });
    });

    it('メッセージIDがユニークである', () => {
      const ids = ENCOURAGEMENT_MESSAGES.map(m => m.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('各カテゴリに適切なメッセージが含まれている', () => {
      const categories = ['greeting', 'progress', 'motivation', 'completion', 'goal', 'daily', 'challenge'];
      
      categories.forEach(category => {
        const messagesInCategory = ENCOURAGEMENT_MESSAGES.filter(m => m.category === category);
        expect(messagesInCategory.length).toBeGreaterThan(0);
      });
    });
  });
});
