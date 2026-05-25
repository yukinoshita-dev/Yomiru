# ADR-0002: トップページデザイン刷新 — 行燈（Andon）ランディングの採用

**日付**: 2026-05-25  
**ステータス**: 承認済み  
**担当**: T-032

---

## コンテキスト

現在の `src/app/page.tsx`（トップページ）はテキストのみの最小構成で、製品の体験をまったく伝えられていない。  
`F:\Hobby\Yomiru\` にデザインキャンバスと3種のランディングバリアントが用意されており、今回はそれを Next.js 実装へ移植する。

## 検討したバリアント

| バリアント | コンセプト | 長所 | 短所 |
|---|---|---|---|
| **Andon（行燈）** | 漆黒＋暖色グロー・リーダーがヒーロー | Yomiru のコアUXを直接体験できる・最もコンテキスト一致 | スマホ横向き時のレイアウト調整が要る |
| Kami（紙と墨） | クリーム和紙テクスチャ・縦組みコラム | 文学的な雰囲気 | 既存ダークテーマと世界観が競合 |
| Akari（灯と頁） | 左ライブデモ＋右機能説明・二分割 | 情報量が多い | 初回訪問者には複雑すぎる可能性 |

## 決定

**Andon（行燈）** を採用する。

理由:
1. 「文節が灯のように中央に現れる」という製品コアを、ページ自体で体験させられる
2. TSX版（`F:\Hobby\Yomiru\tsx\src\components\YomiruLanding.tsx`）がほぼ完成しており、移植コストが最小
3. 既存のダーク系テーマ（lamp / dark）との一貫性が高い

## 変更スコープ

| ファイル | 変更内容 |
|---|---|
| `src/app/globals.css` | Andon テーマトークン追加（`@theme` ブロック）、`writing-vrl` ユーティリティ、アニメーション keyframe |
| `src/app/layout.tsx` | `next/font` で Shippori Mincho / Noto Sans JP / Cormorant Garamond を追加 |
| `src/app/page.tsx` | Andon ランディング実装（`'use client'`、useBunsetsuCycle、Feature/KeyCap サブコンポーネント） |
| `src/data/bunsetsu.ts` | KOKORO_BUNSETSU サンプルデータ（新規） |
| `src/hooks/useBunsetsuCycle.ts` | 文節サイクルフック（新規） |

## 影響範囲

- `/library`・`/reader`・`/settings` ルートへの影響なし
- PWA manifest・OGP メタは変更なし
- globals.css の `:root` カラーはインク系に変更（既存ダークテーマと整合）

## 参考ファイル

- `F:\Hobby\Yomiru\landings\andon.jsx` — オリジナルデザイン
- `F:\Hobby\Yomiru\tsx\src\components\YomiruLanding.tsx` — TSX移植済み版
- `F:\Hobby\Yomiru\tsx\src\hooks\useBunsetsuCycle.ts` — フック実装
- `F:\Hobby\Yomiru\tsx\src\data\bunsetsu.ts` — サンプルデータ
- `F:\Hobby\Yomiru\tsx\src\app\globals.css` — Tailwind v4 テーマ定義
