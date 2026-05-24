# Yomiru - 文節リーダーPWA

## プロジェクト概要

Yomiru は、電子書籍を文節ごとに1チャンクずつ画面中央へ表示する自動送り PWA リーダー。
視点固定で読める体験、睡眠導入、ページめくり不要の楽さを狙う。
認証なし、同期なし、IndexedDB ローカル完結を基本とする。

## 技術スタック

| 領域 | 技術 |
|---|---|
| フレームワーク | Next.js 15 (App Router) |
| UI | React 19 |
| 言語 | TypeScript 5.6 |
| CSS | Tailwind CSS v4 |
| 永続化 | Dexie / IndexedDB |
| 状態管理 | zustand |
| アニメーション | Framer Motion |
| PWA | `@ducanh2912/next-pwa` |
| 開発ツール | Bun |
| テスト | Vitest 4 |

## 主要機能

- 文節自動送り
- 睡眠最適化モード
- `.txt` / EPUB / 青空文庫対応
- 青空文庫ルビ記法対応
- IndexedDB ローカル保存
- PWA オフライン動作

## コーディング規約

- TypeScript strict 前提
- コメントは最小限
- 純関数を優先
- I/O は境界に閉じ込める
  - File 読み込み
  - IndexedDB
  - Worker
  - ブラウザ API
- UI から Dexie を直接触らない
- DB 操作は `src/lib/db/repositories` に集約
- 文節分割、ルビ解析、睡眠ランプ計算はテストしやすい純関数にする
- 依存追加は必要最小限
- 大きな書籍処理は Worker へ逃がし、メインスレッドを塞がない

## テスト方針

- 自動テストは Vitest
- ロジック層はユニットテストを優先
  - `segmenter`
  - `aozoraRuby`
  - parsers
  - repositories
  - sleepRamp
  - readerEngine
- IndexedDB は `fake-indexeddb` で検証
- UI 動作は手動 QA
  - スマホ表示
  - PWA インストール
  - Offline
  - タップ/スワイプ/キーボード操作
  - light/dark/lamp テーマ

## 開発ルール

- 実装・修正は原則 Codex MCP
- Git 操作は Git MCP
- 1タスク=1コミット
- commit 後に `Tasks.md` を更新済みにする
- push 禁止
- npm scripts ではなく `bun run ...` を使う

## Codex 実行環境の制約（重要）

このプロジェクトは Windows の Codex sandbox 環境で実行されます。
以下のルールを **必ず守ること**:

- **PowerShell / cmd / shell / exec ツールは使用禁止** — サンドボックスが exit -1 でブロックする

### ファイル読み取り
`node_repl/js` ツールで `await import('fs')` 形式を使う（`require` は ESM 環境で使えない）:
```javascript
const fs = (await import('fs')).default;
const content = fs.readFileSync('F:/Hobby/Book/src/lib/utils/id.ts', 'utf8');
content
```

### ファイル書き込み・新規作成
**node_repl/js の writeFileSync は新規ファイル作成で EPERM になる。**
- 既存ファイルの編集 → Codex 内蔵の edit/write ツールを使う
- 新規ファイル作成 → Codex 内蔵の write ツールを使う（node_repl/js は使わない）

### コマンド実行（テスト等）
`node_repl/js` で `await import('child_process')` を使い、**必ず `cwd` を指定する**:
```javascript
const { execSync } = await import('child_process');
execSync('bun run vitest run --passWithNoTests', { cwd: 'F:/Hobby/Book', encoding: 'utf8', timeout: 120000 });
```
- テストコマンドは `bun run vitest run --passWithNoTests`（`bun run test:run` は sandbox 内で失敗する場合がある）

### Git 操作
Git MCP ツール（`mcp__git__*`）を使う

## 重要ファイル

| ファイル | 役割 |
|---|---|
| `src/lib/segmenter/segmenter.ts` | 文節分割 |
| `src/lib/ruby/aozoraRuby.ts` | 青空文庫ルビ解析 |
| `src/lib/db/repositories.ts` | Dexie 永続化境界 |
| `src/features/reader/useReaderEngine.ts` | 自動送り制御 |
| `src/app/reader/[bookId]/page.tsx` | リーダー UI 統合 |
