# ADR-0001: 主要技術スタックの選定

- Status: Accepted
- Date: 2026-05-22
- Deciders: 悠
- Related: spec.md, docs/design.md

## Context

Yomiru は寝ながら使える PWA リーダーを、個人開発かつポートフォリオ公開を視野に短期間で形にする必要がある。
要件としては次が重要となる。

- スマートフォン向け PWA（インストール可、Offline 対応）
- 認証・サーバー同期なし、ローカル完結
- `.txt` / EPUB / 青空文庫ルビ対応
- 文節中央表示 + クロスフェード + 自動送り
- 睡眠最適化モード（ランプダウン）
- 開発者は C# / VB.NET の業務経験が長く、Next.js / React / TypeScript の個人開発経験あり
- 既存ポートフォリオ群と技術スタックを揃えたい

## Decision

| 領域 | 採用技術 | 主な理由 |
|---|---|---|
| フレームワーク | Next.js 15 (App Router) | 既存ポートフォリオと揃え、PWA / SEO / Vercel デプロイの実績がある |
| UI ランタイム | React 19 | Next.js 15 の前提、Server Component と Client Component の使い分けが可能 |
| 言語 | TypeScript 5.6 (strict) | 純関数中心の設計で型の恩恵が大きい |
| CSS | Tailwind CSS v4 (`@tailwindcss/postcss`) | 既存ポートフォリオに揃え、設定コストが低い |
| 永続化 | Dexie + IndexedDB | サーバー不要・大きめのテキストを保持できる・複合インデックスが使える |
| 状態管理 | zustand | Redux ほどボイラープレートが要らず、Dexie 同期と相性が良い |
| アニメーション | Framer Motion | クロスフェードや黒オーバーレイの段階暗化を宣言的に書ける |
| PWA | `@ducanh2912/next-pwa` | Next.js 15 と互換、設定で十分な制御ができる |
| 開発ツール | Bun | 既存環境ルールでローカル開発は Bun を使う |
| テスト | Vitest 4 + @testing-library/react + fake-indexeddb | 既存ポートフォリオで実績あり、ESM 周りが軽快 |

## Considered Alternatives

- **Remix / Vite SPA**: PWA・SEO・Vercel デプロイの実績を考えると Next.js が優位。
- **Redux Toolkit**: 規模に対して過剰、zustand で十分。
- **localForage**: 単純な KV 用途には合うが、複合インデックスとマイグレーションを考えると Dexie が優位。
- **Workbox 単体**: next-pwa にラップされている前提で十分。直接管理する手間を避ける。
- **Bun + Hono + 独自フレームワーク**: 学習コストとデプロイ整備が増える。短期で形にする要件と合わない。
- **pnpm / npm**: 既存ルールでローカルは Bun を採用済み。Vercel 側のビルドのみ要件に応じて切替。

## Consequences

### Positive

- 既存ポートフォリオと知識・運用が共通化できる
- App Router で `(library)` / `reader/[bookId]` / `settings` を綺麗に分割できる
- Dexie + zustand の組合せで UI と永続化を疎結合に保てる
- Vercel デプロイ + Lighthouse 計測の経路が確立済み

### Negative / Risk

- React 19 のエコシステムが安定しきっていない箇所がある
- Tailwind v4 の PostCSS プラグイン構成は学習コストが残る
- next-pwa は Next.js のアップデートに引きずられやすい

### Follow-ups

- ADR-0002 で永続化スキーマとマイグレーション方針を別途記録する
- ADR-0003 でワーカー / メインスレッド境界の責務を明文化する
- 依存追加は最小限に抑え、新規ライブラリ採用時は ADR を追加する
