// src/data/bunsetsu.ts
export const KOKORO_BUNSETSU = [
  '私は',
  'その人を',
  '常に',
  '「先生」と',
  '呼んでいた。',
  'だから',
  'ここでも',
  'ただ',
  '「先生」と',
  '書くだけで',
  '本名は',
  '打ち明けない。',
  'これは',
  '世間を',
  '憚かる',
  '遠慮と',
  'いうよりも',
  'その方が',
  '私にとって',
  '自然だからである。',
] as const;

export type Bunsetsu = (typeof KOKORO_BUNSETSU)[number];
