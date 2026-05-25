# ADR-0005: PWA基盤を @serwist/next に移行

**日付**: 2026-05-26  
**ステータス**: 承認済み  
**担当**: T-036

---

## コンテキスト

`@ducanh2912/next-pwa@10.2.9` は Next.js 15 と互換性問題があり、本番ビルドで以下のエラーが発生する：

```
TypeError: a[d] is not a function
    at Object.c [as require] (.next/server/webpack-runtime.js:1:127)
Could not find files for /_error in .next/build-manifest.json
Error occurred prerendering page "/library" (or /, /settings)
```

`next.config.ts` で `disable: true` にするとビルドが通るため、原因は確定済み。
T-035 で `dynamic = 'force-dynamic'` による防御を入れたが、根本解決には PWA 基盤の置き換えが必要。

## 検討した代替案

| 案 | 評価 |
|---|---|
| **@serwist/next** | next-pwa の後継として推奨。Workbox ベース・Next.js 15 サポート公式 |
| @ducanh2912/next-pwa の修正 | パッチ可能性不明・更新停滞気味 |
| 自作 Service Worker | 工数大・Workbox の機能を再実装する必要 |
| PWAを諦める | PWAインストール・オフライン読書というコア機能を失う |

## 決定

**@serwist/next** に移行する。

理由:
1. Next.js 15 を公式サポート
2. Workbox 互換のため既存設定（precache の追加マニフェスト等）を移植しやすい
3. App Router 対応・TypeScript フレンドリー

## 移行手順

1. `@ducanh2912/next-pwa` を package.json から削除
2. `@serwist/next` と `serwist` を追加
3. `next.config.ts` を `withSerwist` でラップし直す
4. `src/app/sw.ts`（Service Worker エントリ）を新規作成し、precache・runtime caching を移植
5. `src/types/serwist.d.ts` で `InjectionPoint` の型を宣言
6. 旧 `public/sw.js` `public/workbox-*.js` `public/swe-worker-*.js` を `.gitignore` に追加

## 移植する PWA 設定

| 項目 | 旧 (next-pwa) | 新 (serwist) |
|---|---|---|
| Service Worker 出力先 | `public/sw.js` | `public/sw.js`（同一） |
| 開発時無効化 | `disable: process.env.NODE_ENV === 'development'` | `disable: process.env.NODE_ENV === 'development'` |
| プリキャッシュ追加 | `workboxOptions.additionalManifestEntries` | `sw.ts` 内で `precacheEntries` に手動追加 |
| 起動時の挙動 | `cacheOnFrontEndNav`, `aggressiveFrontEndNavCaching`, `reloadOnOnline` | デフォルトキャッシュ戦略＋必要に応じカスタム |

サンプル書籍3点のプリキャッシュは必須要件:
- `/samples/rashomon-akutagawa.aozora.txt`
- `/samples/chumon-miyazawa.aozora.txt`
- `/samples/kokoro-soseki.aozora.txt`

## 検証

`bun run build` がエラーゼロ・警告ゼロで完了すること。
`bun run test` の 87 テストが緑のままであること。
`bun run start` でローカル起動し、`/` `/library` `/terms` が表示できること。
Service Worker が登録され、`/samples/*` がオフラインで取得できること。

## ロールバック

問題が出た場合、`disable: process.env.NODE_ENV === 'development' || process.env.DISABLE_PWA === '1'` でローカルだけ PWA 無効化（T-035 で追加済み）して回避できる。
