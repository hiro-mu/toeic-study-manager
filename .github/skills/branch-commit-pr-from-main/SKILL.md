---
name: branch-commit-pr-from-main
description: '上記の会話の内容を踏まえて、実装内容を確認し、mainから適切な名前の作業ブランチを切って内容をコミットし、プルリクエスト作成まで行うワークフロー。Use when: 脆弱性対応, 依存更新, 実装修正, リリース前の定型PR作成。'
argument-hint: '変更の目的（例: 脆弱性対応）と、PRに含めたい要約'
user-invocable: true
disable-model-invocation: false
---

# Branch Commit PR From Main

実装済みの変更を安全に確認し、main から適切な作業ブランチを作成して、コミット、push、PR 作成までを一貫して実行するための skill です。

## When to Use

- 脆弱性対応や依存更新を反映した PR を作るとき
- 実装作業後に、ブランチ運用を含めて提出まで一気に進めたいとき
- 変更が lockfile 中心で、差分要約を明確に残したいとき
- 定型の品質チェックを通して PR を作成したいとき

## Required Inputs

- 変更の目的
1. 例: 脆弱性対応, 不具合修正, リファクタリング

- 任意入力
1. ブランチ命名プレフィックス
2. コミットメッセージ方針
3. PR タイトル/本文の言語

## Output Contract

最終出力は次の情報を必ず含める。

1. 作成したブランチ名
2. コミット SHA とコミットメッセージ
3. 変更ファイルの要約
4. PR 番号と URL
5. 未実施検証の有無

## Procedure

1. 変更内容を確認する
- `git status --short` と `git status -sb` で状態確認
- `git diff --stat` で差分規模を確認
- 必要なら `git diff` で主要変更を確認

2. 作業前提を満たす
- 現在ブランチが `main` でない場合は、まず `main` へ移動する
- `main` の更新が必要なら `git pull` で同期する
- 想定外の未コミット変更が混在する場合は中断し、対象範囲を明確化する

3. ブランチ名を決定する
- 目的に応じたプレフィックスを使う
- 例:
  - `chore/security-deps-update-YYYYMMDD`
  - `fix/<scope>-<short-topic>`
  - `feat/<scope>-<short-topic>`

4. ブランチ作成とコミットを行う
- `git switch -c <branch-name>`
- 対象ファイルのみ `git add`
- `git commit -m "<type>: <summary>"`

5. push して upstream を設定する
- `git push -u origin <branch-name>`

6. PR を作成する
- base は `main`
- head は作成したブランチ
- PR 本文には次を含める
  - 概要
  - 変更内容
  - 影響範囲
  - 確認観点
  - 補足（lockfile のみ等）

7. 完了チェックを行う
- `git status -sb` がクリーンであること
- PR が OPEN で作成されていること
- URL を共有できること

## Decision Points

- 差分が lockfile のみか
- lockfile のみ: 影響範囲を「依存解決のみ」に限定して記載
- lockfile 以外も含む: 変更ファイル別に影響範囲を分けて記載

- 破壊的変更を伴う更新か
- 伴う: PR を draft にする、または明示的にリスクとロールバック方針を記載
- 伴わない: 通常 PR として作成

- テスト実行の必要性
- 実装コード変更あり: 主要テスト実行を推奨
- lockfile のみ: 最低限インストール/ビルド観点を記載

## Quality Criteria

- ブランチ名が目的を説明している
- コミット対象が意図したファイルのみに限定されている
- PR 説明に目的、影響、確認観点がある
- 追跡可能な成果物（SHA と PR URL）が提示されている

## Failure Handling

- push 失敗時
  - 認証/権限/ネットワークを切り分ける
  - 必要なら再試行し、失敗原因を明記する

- PR 作成失敗時
  - `head` / `base` の誤りを確認
  - 既存同名 PR の有無を確認
  - 手動作成 URL を提示して暫定対応する

## Example Prompts

- /branch-commit-pr-from-main 脆弱性対応で更新した lockfile を、main 起点でブランチ作成して PR まで進めて
- /branch-commit-pr-from-main 実装内容を確認して、適切なブランチ名でコミットし、PR本文も作成して
- /branch-commit-pr-from-main 依存更新の差分を要約しつつ、提出可能な PR を作って
