import type { RubyToken } from "@/types";

export type SegmentedChunk = {
  text: string;
  ruby?: RubyToken[];
  chapterIndex?: number;
};

export interface SegmentInput {
  text: string;
  ruby?: RubyToken[];
  chapterIndex?: number;
}

export interface SegmentOptions {
  /** ルビトークンの「base」位置を text 上で探索する開始オフセット (省略時 0) */
  textOffset?: number;
}

type ChunkRange = {
  start: number;
  end: number;
};

type ChunkDraft = SegmentedChunk & ChunkRange;

const BOUNDARY_PUNCTUATION = new Set(["、", "。", "！", "？", "!", "?"]);

export function segment(
  input: SegmentInput,
  options?: SegmentOptions,
): SegmentedChunk[] {
  const drafts = createChunkDrafts(input);

  if (input.ruby !== undefined && input.ruby.length > 0) {
    distributeRuby(input.text, input.ruby, drafts, options?.textOffset);
  }

  return drafts.map(toSegmentedChunk);
}

export function segmentAll(inputs: SegmentInput[]): SegmentedChunk[] {
  return inputs.flatMap((input) => segment(input));
}

function createChunkDrafts(input: SegmentInput): ChunkDraft[] {
  return findRawRanges(input.text)
    .map((range) => trimRange(input.text, range))
    .filter((range) => range.start < range.end)
    .map((range) => ({
      ...range,
      text: input.text.slice(range.start, range.end),
      ...(input.chapterIndex !== undefined
        ? { chapterIndex: input.chapterIndex }
        : {}),
    }));
}

function toSegmentedChunk(chunk: ChunkDraft): SegmentedChunk {
  return {
    text: chunk.text,
    ...(chunk.ruby !== undefined ? { ruby: chunk.ruby } : {}),
    ...(chunk.chapterIndex !== undefined
      ? { chapterIndex: chunk.chapterIndex }
      : {}),
  };
}

function findRawRanges(text: string): ChunkRange[] {
  const ranges: ChunkRange[] = [];
  let start = 0;
  let index = 0;

  while (index < text.length) {
    if (text[index] === "\n") {
      ranges.push({ start, end: index });
      index += 1;
      start = index;
      continue;
    }

    if (BOUNDARY_PUNCTUATION.has(text[index])) {
      let end = index + 1;
      while (end < text.length && BOUNDARY_PUNCTUATION.has(text[end])) {
        end += 1;
      }
      ranges.push({ start, end });
      index = end;
      start = end;
      continue;
    }

    index += 1;
  }

  ranges.push({ start, end: text.length });
  return ranges;
}

function trimRange(text: string, range: ChunkRange): ChunkRange {
  let start = range.start;
  let end = range.end;

  while (start < end && isWhitespace(text[start])) {
    start += 1;
  }

  while (end > start && isWhitespace(text[end - 1])) {
    end -= 1;
  }

  return { start, end };
}

function isWhitespace(char: string): boolean {
  return char.trim() === "";
}

function distributeRuby(
  text: string,
  ruby: RubyToken[],
  chunks: ChunkDraft[],
  textOffset = 0,
): void {
  let searchStart = clampOffset(textOffset, text.length);

  for (const token of ruby) {
    if (token.base.length === 0) {
      continue;
    }

    const start = text.indexOf(token.base, searchStart);
    if (start === -1) {
      continue;
    }

    const chunk = findRubyChunk(chunks, start, start + token.base.length);
    if (chunk !== undefined) {
      chunk.ruby = [...(chunk.ruby ?? []), token];
    }

    searchStart = start + token.base.length;
  }
}

function clampOffset(offset: number, textLength: number): number {
  if (offset < 0) {
    return 0;
  }

  if (offset > textLength) {
    return textLength;
  }

  return offset;
}

function findRubyChunk(
  chunks: ChunkDraft[],
  tokenStart: number,
  tokenEnd: number,
): ChunkDraft | undefined {
  const containingStart = chunks.find(
    (chunk) => tokenStart >= chunk.start && tokenStart < chunk.end,
  );

  if (containingStart !== undefined) {
    return containingStart;
  }

  return chunks.find(
    (chunk) => tokenStart < chunk.end && tokenEnd > chunk.start,
  );
}
