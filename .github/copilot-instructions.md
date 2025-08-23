<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# TOEIC Study Manager - GitHub Copilot指示書

## 🎯 プロジェクト概要

このプロジェクトは、TOEIC学習を効率的に管理するためのReact/Next.jsベースのWebアプリケーションです。タスク管理、学習進捗の追跡、統計分析、カレンダービューなどの機能を提供します。

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15.4.6** (App Router)
- **React 19.1.0** (Client Components)
- **TypeScript 5.9.2** (厳格な型付け)
- **Tailwind CSS v4** (ユーティリティファースト)

### 開発・テストツール
- **Jest 30.0.5** + **Testing Library** (テスト)
- **ESLint** + **TypeScript ESLint** (静的解析)
- **Turbopack** (高速開発サーバー)

### データ管理
- **LocalStorage** (クライアントサイドデータ永続化)
- **React Hooks** (useState, useEffect)

## 📋 コーディング規約とベストプラクティス

### 1. TypeScript規約
```typescript
// ✅ 推奨: 明示的な型定義
interface TaskProps {
  task: Task;
  onComplete: (id: number) => void;
}

// ✅ 推奨: Unionタイプの活用
type TaskCategory = 'reading' | 'listening' | 'grammar' | 'vocabulary' | 'mock-test' | 'other';

// ❌ 避ける: any型の使用
const data: any = getData(); // 避ける
```

### 2. React Component規約
```tsx
// ✅ 推奨: 関数コンポーネント + TypeScript
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export default function Component({ title, onAction }: ComponentProps) {
  return <div>{title}</div>;
}

// ✅ 推奨: Client Componentの明示
'use client';

// ✅ 推奨: 適切なHooksの使用
const [state, setState] = useState<Type>(initialValue);
```

### 3. ファイル・ディレクトリ命名規約
```
src/
├── app/                    # Next.js App Router (PascalCase)
├── components/             # Reactコンポーネント (PascalCase.tsx)
├── types/                  # 型定義 (camelCase.ts)
├── utils/                  # ユーティリティ (camelCase.ts)
└── __tests__/             # テストファイル (kebab-case.test.tsx)
```

### 4. CSS/Tailwind規約
```tsx
// ✅ 推奨: Tailwindクラスの論理的グループ化
<div className="
  // Layout
  flex flex-col items-center
  // Spacing
  p-5 mb-5
  // Appearance
  bg-white rounded-2xl shadow-lg
  // Typography
  text-center text-primary
">

// ✅ 推奨: レスポンシブクラスの使用
<div className="w-full md:w-1/2 lg:w-1/3">
```

## 🏗️ アーキテクチャパターン

### コンポーネント設計原則
1. **単一責任原則**: 1つのコンポーネントは1つの責任のみ
2. **Props Drilling回避**: 深いネストでの値渡しを避ける
3. **状態の局所化**: 状態は最も近い共通祖先で管理
4. **再利用性**: 汎用的なコンポーネントの作成

### データフロー
```
LocalStorage → useEffect → State → Components → Event Handlers → State → LocalStorage
```

### ファイル構成パターン
```typescript
// types/index.ts - 型定義の集約
export interface Task {
  id: number;
  title: string;
  // ...
}

// utils/statistics.ts - ビジネスロジックの分離
export function calculateProgress(tasks: Task[]): number {
  // ...
}

// components/TaskList.tsx - プレゼンテーション層
export default function TaskList({ tasks, onAction }: Props) {
  // ...
}
```

## 🧪 テスト規約

### テストファイル命名
- **Unit Test**: `ComponentName.test.tsx`
- **Integration Test**: `feature-name.test.tsx`
- **Utility Test**: `utility-name.test.ts`

### テストパターン
```typescript
// ✅ 推奨: AAA パターン (Arrange, Act, Assert)
describe('TaskList Component', () => {
  it('should display tasks correctly', () => {
    // Arrange
    const mockTasks = [{ id: 1, title: 'Test Task' }];
    
    // Act
    render(<TaskList tasks={mockTasks} onAction={mockFn} />);
    
    // Assert
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

## 📦 インポート規約

### インポート順序
```typescript
// 1. React/Next.js関連
import { useState, useEffect } from 'react';
import { NextPage } from 'next';

// 2. 外部ライブラリ
import classNames from 'classnames';

// 3. 内部モジュール (絶対パス)
import { Task } from '@/types';
import { calculateProgress } from '@/utils/statistics';
import Header from '@/components/Header';

// 4. 相対パス
import './styles.css';
```

## 🎨 UI/UX設計指針

### デザインシステム
- **カラーパレット**: グラデーション (`from-blue-400 to-purple-600`)
- **コンポーネント**: カード型レイアウト (`rounded-2xl shadow-lg`)
- **タイポグラフィ**: Inter フォント
- **アイコン**: 絵文字ベース (📚, ✅, 📊)

### アクセシビリティ
```tsx
// ✅ 推奨: セマンティックHTML
<button aria-label="タスクを完了する" onClick={handleComplete}>
  ✅
</button>

// ✅ 推奨: フォーカス管理
<input 
  autoFocus
  aria-describedby="error-message"
  className="focus:ring-2 focus:ring-blue-500"
/>
```

## 🔧 開発時の注意事項

### 1. パフォーマンス
- `React.memo`での不要な再レンダリング防止
- `useCallback`、`useMemo`の適切な使用
- 大きなリストでの仮想化検討

### 2. エラーハンドリング
```typescript
// ✅ 推奨: 適切なエラーハンドリング
try {
  const data = JSON.parse(localStorage.getItem('toeicTasks') || '[]');
  setTasks(data);
} catch (error) {
  console.error('Failed to load tasks:', error);
  setTasks([]);
}
```

### 3. セキュリティ
- ユーザー入力のサニタイゼーション
- XSS対策（React標準で提供）
- LocalStorageデータの検証

## 📚 ドキュメント管理

### 必須更新対象
1. **`docs/ARCHITECTURE.md`** - アーキテクチャ変更時
2. **`README.md`** - 機能追加時
3. **JSDoc** - 関数・クラス作成時

### コメント規約
```typescript
/**
 * タスクの完了率を計算する
 * @param tasks - タスクの配列
 * @returns 完了率（0-100の整数）
 */
export function calculateProgress(tasks: Task[]): number {
  // 実装...
}
```

## 🚀 機能開発時の指針

### 新機能追加時のチェックリスト
- [ ] 型定義の追加・更新
- [ ] コンポーネントの単体テスト
- [ ] アクセシビリティ検証
- [ ] レスポンシブデザイン確認
- [ ] エラーハンドリング実装
- [ ] ドキュメント更新

### 既存機能修正時の確認事項
- [ ] 既存テストの実行・修正
- [ ] 影響範囲の調査
- [ ] パフォーマンス影響確認
- [ ] ブラウザ互換性検証

## 🎯 品質基準

### コード品質
- **ESLint**: エラー0、警告最小限
- **TypeScript**: 厳格モード、any型使用禁止
- **テストカバレッジ**: 80%以上目標

### ユーザビリティ
- **ローディング時間**: 3秒以内
- **レスポンシブ**: モバイル対応必須
- **アクセシビリティ**: WCAG 2.1 AA準拠

---

**注意**: このプロジェクトは学習管理アプリケーションです。ユーザーの学習データの整合性と利便性を最優先に考慮してコードを作成してください。
