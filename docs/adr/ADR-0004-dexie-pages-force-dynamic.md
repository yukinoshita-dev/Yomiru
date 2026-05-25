# ADR-0004: クライアント完結ページのSSR防御強化

**日付**: 2026-05-26  
**ステータス**: 承認済み（追記あり）  
**担当**: T-035

## 重要追記（事後判明）

このADRは当初「Dexie の SSR 不適合が `/library` プリレンダー失敗の原因」と仮定して書かれた。
しかし T-035 実装後の再ビルドで以下が判明:

- `/library` への `dynamic = 'force-dynamic'` 追加後も別ページ（`/settings` `/`）で同種の `TypeError: a[d] is not a function` が発生する
- `next.config.ts` で next-pwa を一時的に `disable: true` にすると、すべてのページが正常にプリレンダーされる
- 真の原因は **@ducanh2912/next-pwa 10.2.9 と Next.js 15 の webpack-runtime 互換性問題**

このため本タスク T-035 は「SSR 防御強化」として残し、PWA ビルド失敗の根本対応は **T-036（@serwist/next 移行）** で行う。

force-dynamic の付与自体は防御的に有効（Dexie/localStorage 依存ページの SSR フェイルセーフ）なので、変更内容はそのまま維持する。

---

## コンテキスト

`bun run build` 実行時、`/library` ページのプリレンダーで以下のエラーが発生する：

```
TypeError: a[d] is not a function
    at Object.c [as require] (F:\Hobby\Book\.next\server\webpack-runtime.js:1:127)
Error occurred prerendering page "/library"
```

原因: `src/app/library/page.tsx` が import している Dexie リポジトリ（`@/lib/db/repositories/books` 等）が、モジュール読み込み時に IndexedDB を参照する Dexie インスタンスを初期化しているため、サーバー側プリレンダー時に webpack ランタイムエラーになる。

注意: このバグは T-031 以前から潜在しており、T-032〜T-034 の変更とは無関係である（stash で再現確認済み）。

## 検討した代替案

| 方針 | 評価 |
|---|---|
| **`export const dynamic = 'force-dynamic'`** | 簡潔・Next.js公式の解決手段。本ページは完全クライアント依存なのでSSGの恩恵を受けない |
| `next/dynamic` で `ssr: false` ラッパー | コード分割が増え過剰 |
| Dexie インスタンスを lazy 化 | DB レイヤ全体の改修が必要、影響範囲が大きい |
| `output: 'export'` をやめる | すでに `standalone` を使っているので本質的な解決ではない |

## 決定

**`export const dynamic = 'force-dynamic'` を Dexie に依存する全ページに付与する。**

対象:
- `src/app/library/page.tsx`（確定）
- `src/app/reader/[id]/page.tsx`（Dexie 経由で書籍読み込み）
- `src/app/settings/page.tsx`（設定ストアが Dexie 同期）

## 影響範囲

- ホスティング: Vercel の Edge / Node ランタイムで動的レンダリング（SSR）になる
- PWA: Service Worker のキャッシュ動作には影響しない
- Lighthouse: 初期 TTFB がわずかに増えるが、これらのページはどのみち IndexedDB 読み込み後にハイドレートされるため体感差はない
- トップページ (`/`)・利用規約 (`/terms`) は静的生成を維持する（Dexie に依存しないため）

## 検証

`bun run build` がエラーゼロで通ること。
`bun run test` の 87 テストが緑のままであること。
