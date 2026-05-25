# ADR-0007: しおり（Bookmark）機能の追加

**日付**: 2026-05-26  
**ステータス**: 承認済み  
**担当**: T-038

---

## コンテキスト

T-037 でリーダーヘッダーに ☆ アイコンを追加したが、現状は空関数。
読書中に任意の文節位置をマーキングし、後から再訪できる「しおり機能」を実装する。

## 決定

### データモデル

新規型 `Bookmark`：

```ts
export interface Bookmark {
  id: string;            // `${bookId}:${chunkIndex}` で一意化
  bookId: string;
  chunkIndex: number;
  label?: string;        // 任意のメモ（MVPでは未使用）
  excerpt: string;       // 当該文節の先頭部分（一覧表示用）
  createdAt: number;     // epoch ms
}
```

### Dexie スキーマ（version 2 マイグレーション）

```ts
this.version(2).stores({
  // 既存テーブルは変更なし
  bookmarks: "id, bookId, chunkIndex, createdAt, [bookId+chunkIndex]",
});
```

`[bookId+chunkIndex]` 複合インデックスで「ある書籍のある文節がしおり済みか」を高速チェックできる。

### リポジトリ

`src/lib/db/repositories/bookmarks.ts` を新規作成：
- `addBookmark(bookId, chunkIndex, excerpt): Promise<Bookmark>`
- `removeBookmark(bookId, chunkIndex): Promise<void>`
- `isBookmarked(bookId, chunkIndex): Promise<boolean>`
- `listBookmarksByBook(bookId): Promise<Bookmark[]>` — chunkIndex 昇順
- `listAllBookmarks(): Promise<Bookmark[]>` — createdAt 降順

### UI 統合

| 場所 | 動作 |
|---|---|
| ReaderHeader ☆ | 押下で現在文節をトグル。bookmarked 状態は Dexie から購読 |
| ライブラリページ | 上部に「しおり」セクション（最新3〜5件）を追加。クリックで `/reader/[bookId]?at=<index>` に遷移 |
| /library のしおりカード | 書籍名・抜粋・章番号・日時を表示。長押し or ×ボタンで削除 |
| ReaderPage | URL パラメータ `?at=<index>` を読み、初期 startIndex に上書き |

### 復帰時の遷移

`/reader/[bookId]?at=12` のように `searchParams.at` を見て、存在する場合は `getReadingState` の currentIndex より優先して採用する。

## 検討した代替案

| 案 | 評価 |
|---|---|
| **専用 Dexie テーブル** | ✅ クエリ柔軟・既存スキーマ非侵襲 |
| ReadingState 内に bookmarks[] 配列 | 1冊あたり全しおりが ReadingState 更新で書き換わるため非効率 |
| localStorage 保存 | ライブラリ横断検索が難しい・Dexie統一感が崩れる |

## 検証

- `bun run test` で 91 + 新規テスト（リポジトリ単体テスト）が緑になる
- `bun run build` がエラーゼロで完了
- ReaderHeader の ☆ がトグルし、再読み込み後も状態維持
- /library 上部にしおり一覧が表示され、クリックで該当位置にジャンプ
- 削除した書籍のしおりは自動的にライブラリページから除外される

## 非影響

- 既存の ReadingState（読書進捗）と独立。同じ書籍に「最後に読んだ位置」と「しおり」が共存可能
- AppSettings 変更なし
- 既存の 91 テストへの影響なし
