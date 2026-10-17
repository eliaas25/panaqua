import { describe, it, expect } from 'vitest';
import { formatPrice } from '../utils/format';

describe('formatPrice', () => {
  it('formats ARS currency with Argentine locale', () => {
    const result = formatPrice(32500);
    expect(result).toContain('32.500');
    expect(result).toMatch(/\$|ARS/);
  });

  it('formats zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });

  it('formats large amounts', () => {
    const result = formatPrice(1500000);
    expect(result).toContain('1.500.000');
  });

  it('returns a string', () => {
    expect(typeof formatPrice(100)).toBe('string');
  });
});
