import { describe, expect, it } from 'vitest';
import { clamp } from '@/lib/utils/clamp';

describe('clamp', () => {
  it('clamps below min', () => { expect(clamp(-5, 0, 10)).toBe(0); });
  it('clamps above max', () => { expect(clamp(15, 0, 10)).toBe(10); });
  it('returns value within range', () => { expect(clamp(5, 0, 10)).toBe(5); });
});
