# TOEIC Study Manager

TOEIC学習の進捗管理アプリケーション。タスク管理、目標設定、進捗の可視化機能を提供します。

## 技術スタック

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ESLint

## プロジェクト構成

```plaintext
toeic_learn_app/
├── .github/
│   └── copilot-instructions.md    # GitHub Copilot用の指示ファイル
├── public/                        # 静的ファイル
├── src/                          # ソースコード
│   ├── app/                      # Next.js App Router
│   │   ├── globals.css          # グローバルスタイル
│   │   ├── layout.tsx          # ルートレイアウト
│   │   └── page.tsx            # メインページ
│   └── components/              # Reactコンポーネント
│       ├── CompletionModal.tsx  # タスク完了モーダル
│       ├── Header.tsx          # ヘッダーコンポーネント（目標設定）
│       ├── TaskForm.tsx        # タスク作成フォーム
│       └── TaskList.tsx        # タスク一覧
├── .vscode/                     # VS Code設定
├── eslint.config.mjs           # ESLint設定
├── next.config.ts              # Next.js設定
├── postcss.config.mjs          # PostCSS設定
└── tsconfig.json               # TypeScript設定
```

## 主要コンポーネント

### Header (`components/Header.tsx`)

- 目標TOEICスコアの設定
- 試験日の設定
- 目標の保存と更新

### TaskForm (`components/TaskForm.tsx`)

- 新規タスクの作成
- カテゴリー選択（リスニング、リーディング、単語、文法）
- 期限の設定
- タスクの説明追加

### TaskList (`components/TaskList.tsx`)

- タスク一覧の表示
- タスクの完了処理
- タスクの削除
- 期限切れタスクの強調表示

### CompletionModal (`components/CompletionModal.tsx`)

- タスク完了時の詳細記録
- 学習時間の記録
- 難易度の記録
- 集中度の記録

## セットアップ

1. 依存パッケージのインストール:

```bash
npm install
```

1. 開発サーバーの起動:

```bash
npm run dev
```

1. ブラウザでアクセス:

```plaintext
http://localhost:3000
```

## 主要機能

- タスク管理（作成、完了、削除）
- 目標設定（スコア、試験日）
- 進捗の可視化
- 学習時間の記録
- カテゴリー別のタスク管理
- 期限切れタスクの警告表示

## データ保存

現在の実装では、すべてのデータをブラウザのローカルストレージに保存しています：

- `toeicTasks`: 未完了のタスク
- `toeicCompletedTasks`: 完了済みのタスク
- `toeicGoals`: 目標設定（スコア、試験日）
