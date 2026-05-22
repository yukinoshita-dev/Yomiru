# Yomiru - 文節リーダーPWA

## Commit Workflow

- 1タスク=1コミットで進める。PRサイズに収め、複数タスクをまとめない
- 実装は Codex MCP に小粒度で依頼し、タスクごとに個別コミットする
- 完了したタスクごとに `Tasks.md` / `tasks.md` のステータスを更新する

## プロジェクト概要

Yomiru は、電子書籍を文節ごとに1チャンクずつ画面中央へ表示する自動送り PWA リーダー。
視点を固定したまま読めるため、目の疲れを減らし、寝ながらの読書と睡眠導入を支援する。
認証やサーバー同期は行わず、IndexedDB によるローカル完結を基本とする。

## 技術スタック

| 領域 | 技術 |
|---|---|
| フレームワーク | Next.js 15 (App Router) |
| UI | React 19 |
| 言語 | TypeScript 5.6 |
| CSS | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| 永続化 | Dexie / IndexedDB |
| 状態管理 | zustand |
| アニメーション | Framer Motion |
| PWA | `@ducanh2912/next-pwa` |
| 開発ツール | Bun |
| テスト | Vitest 4 |

## 主要機能

- 文節自動送り
  - 秒/文節で速度指定
  - 中央表示とクロスフェード
  - タップ/スワイプ/キーボード操作
- 睡眠最適化モード
  - 時間経過で自動減速
  - 黒オーバーレイで段階的に暗化
  - ランプダウン完了後に停止
- 形式対応
  - `.txt`
  - EPUB
  - 青空文庫テキスト/ルビ記法
- ローカル完結
  - IndexedDB に書籍、チャンク、読書状態、設定を保存
  - 認証なし
  - サンプル書籍同梱

## ユーザー情報

- 30歳
- C# / VB.NET 業務経験が長い
- Next.js / React / TypeScript の個人開発経験あり
- Bun 使用希望
- ポートフォリオ公開を視野に入れる
- push 禁止
- 1タスク=1コミットを重視

## 開発方針

- 実装・コード修正・テスト追加・リファクタリングは原則 Codex MCP を使用する
- Git 操作は Git MCP を使用する
- commit は1機能/1タスクごとに行う
- push は禁止
- npm scripts ではなく、既存の `bun run ...` scripts を使う
- コメントは最小限。意図が読み取りにくい複雑な処理のみ短く補足する
- TypeScript は strict 前提
- 純関数を優先し、I/O は DB、Worker、UI 境界へ閉じ込める
- UI 層から Dexie を直接触らず、`src/lib/db/repositories` を経由する
- 作業後は変更ファイル、検証結果、未確認事項を日本語で報告する

## 重要ファイル

| ファイル | 役割 |
|---|---|
| `src/lib/segmenter/segmenter.ts` | 文節分割の核 |
| `src/lib/ruby/aozoraRuby.ts` | 青空文庫ルビ記法パーサ |
| `src/lib/db/repositories.ts` | Dexie CRUD 抽象 |
| `src/features/reader/useReaderEngine.ts` | 自動送り/睡眠ランプの再生状態機械 |
| `src/app/reader/[bookId]/page.tsx` | リーダー本体ページ |

## 検証コマンド

```bash
bun run lint
bun run test:run
bun run build
```

## コミットメッセージ

- 形式: `T-XXX: 概要`
- 例: `T-002: documentation skeleton (CLAUDE/AGENTS/spec/README/Tasks)`
- 1コミットに複数タスクを混ぜない
