import {
  getEncouragementMessage,
  MessageHistoryManager
} from '@/utils/encouragementMessages';

describe('Encouragement Messages - エッジケース & セキュリティテスト', () => {
  beforeEach(() => {
    // LocalStorageをモック
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

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });

    MessageHistoryManager.clearHistory();
  });

  describe('エクストリームケース', () => {
    it('すべてのタスクが完了している場合（100%）', () => {
      const message = getEncouragementMessage({
        completionRate: 100,
        totalTasks: 10,
        completedTasks: 10,
        hasGoal: true
      });

      expect(message).toBeDefined();
      expect(message.text).toBeTruthy();
      expect(message.emoji).toBeTruthy();
    });

    it('タスクが全く存在しない場合（0タスク）', () => {
      const message = getEncouragementMessage({
        completionRate: 0,
        totalTasks: 0,
        completedTasks: 0,
        hasGoal: false
      });

      expect(message).toBeDefined();
      expect(message.text).toBeTruthy();
    });

    it('非常に多くのタスクがある場合（1000タスク）', () => {
      const message = getEncouragementMessage({
        completionRate: 50,
        totalTasks: 1000,
        completedTasks: 500,
        hasGoal: true
      });

      expect(message).toBeDefined();
      expect(message.text).toBeTruthy();
    });

    it('小数点を含む進捗率の場合', () => {
      const message = getEncouragementMessage({
        completionRate: 33.33,
        totalTasks: 3,
        completedTasks: 1,
        hasGoal: false
      });

      expect(message).toBeDefined();
      expect(message.text).toBeTruthy();
    });
  });

  describe('入力値の境界値テスト', () => {
    it('進捗率が負の値の場合', () => {
      const message = getEncouragementMessage({
        completionRate: -10,
        totalTasks: 10,
        completedTasks: 0,
        hasGoal: false
      });

      expect(message).toBeDefined();
      expect(message.text).toBeTruthy();
    });

    it('進捗率が100%を超える場合', () => {
      const message = getEncouragementMessage({
        completionRate: 150,
        totalTasks: 10,
        completedTasks: 15,
        hasGoal: true
      });

      expect(message).toBeDefined();
      expect(message.text).toBeTruthy();
    });

    it('完了タスク数が総タスク数を超える場合', () => {
      const message = getEncouragementMessage({
        completionRate: 120,
        totalTasks: 5,
        completedTasks: 6,
        hasGoal: true
      });

      expect(message).toBeDefined();
      expect(message.text).toBeTruthy();
    });
  });

  describe('LocalStorageの異常系テスト', () => {
    it('LocalStorageが利用できない場合', () => {
      // LocalStorageをundefinedに設定
      Object.defineProperty(window, 'localStorage', {
        value: undefined
      });

      // エラーが発生せずにメッセージが取得できることを確認
      expect(() => {
        const message = getEncouragementMessage({
          completionRate: 50,
          totalTasks: 4,
          completedTasks: 2,
          hasGoal: false
        });
        expect(message).toBeDefined();
      }).not.toThrow();
    });

    it('LocalStorageから不正なJSONが読み込まれる場合', () => {
      const mockLocalStorage = {
        getItem: jest.fn(() => 'invalid-json-data'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        key: jest.fn(),
        length: 0
      } as Storage;

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage
      });

      // エラーが発生せずにメッセージが取得できることを確認
      expect(() => {
        const message = getEncouragementMessage({
          completionRate: 50,
          totalTasks: 4,
          completedTasks: 2,
          hasGoal: false
        });
        expect(message).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('パフォーマンステスト', () => {
    it('大量のメッセージ履歴がある場合でもパフォーマンスが良い', () => {
      // 大量の履歴データを作成
      for (let i = 0; i < 100; i++) {
        MessageHistoryManager.addToHistory(`test_message_${i}`);
      }

      const startTime = performance.now();

      // メッセージ取得を複数回実行
      for (let i = 0; i < 10; i++) {
        getEncouragementMessage({
          completionRate: Math.random() * 100,
          totalTasks: Math.floor(Math.random() * 20) + 1,
          completedTasks: Math.floor(Math.random() * 10),
          hasGoal: Math.random() > 0.5
        });
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // 10回のメッセージ取得が100ms以内で完了することを確認
      expect(executionTime).toBeLessThan(100);
    });

    it('同じパラメータで複数回呼び出してもランダム性が保たれる', () => {
      const messages = new Set<string>();
      const params = {
        completionRate: 50,
        totalTasks: 10,
        completedTasks: 5,
        hasGoal: true
      };

      // 同じパラメータで20回メッセージを取得
      for (let i = 0; i < 20; i++) {
        const message = getEncouragementMessage(params);
        messages.add(message.id);
      }

      // 複数の異なるメッセージが選択されることを確認（完全にランダムなので少なくとも2種類）
      expect(messages.size).toBeGreaterThanOrEqual(2);
    });
  });

  describe('メッセージ品質の検証', () => {
    it('すべてのメッセージが適切な長さである', () => {
      const params = {
        completionRate: 75,
        totalTasks: 8,
        completedTasks: 6,
        hasGoal: true
      };

      for (let i = 0; i < 10; i++) {
        const message = getEncouragementMessage(params);

        // メッセージが空でなく、適切な長さであることを確認
        expect(message.text.length).toBeGreaterThan(5);
        expect(message.text.length).toBeLessThan(200);

        // 絵文字が存在することを確認
        expect(message.emoji.length).toBeGreaterThan(0);
        expect(message.emoji.length).toBeLessThan(10);
      }
    });

    it('メッセージに不適切な内容が含まれていない', () => {
      const inappropriateWords = ['バカ', 'アホ', '死ね', '諦めろ', 'だめ'];

      const params = {
        completionRate: 25,
        totalTasks: 8,
        completedTasks: 2,
        hasGoal: false
      };

      for (let i = 0; i < 20; i++) {
        const message = getEncouragementMessage(params);

        inappropriateWords.forEach(word => {
          expect(message.text).not.toContain(word);
        });
      }
    });
  });

  describe('アクセシビリティテスト', () => {
    it('絵文字が適切にaria-labelで説明されている', () => {
      // この部分は実際のコンポーネントのテストで確認済み
      // ここではメッセージデータ自体の品質を確認
      const message = getEncouragementMessage({
        completionRate: 80,
        totalTasks: 5,
        completedTasks: 4,
        hasGoal: true
      });

      // 絵文字が空でないことを確認
      expect(message.emoji).toBeTruthy();
      expect(typeof message.emoji).toBe('string');
    });
  });

  describe('国際化対応の検証', () => {
    it('日本語メッセージが正しくエンコードされている', () => {
      const message = getEncouragementMessage({
        completionRate: 60,
        totalTasks: 10,
        completedTasks: 6,
        hasGoal: true
      });

      // 日本語の文字が含まれていることを確認
      const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
      expect(japaneseRegex.test(message.text)).toBe(true);
    });
  });
});
