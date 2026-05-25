export interface Bookmark {
  id: string;
  bookId: string;
  chunkIndex: number;
  label?: string;
  excerpt: string;
  createdAt: number;
}
