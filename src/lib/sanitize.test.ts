import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeIngredients } from './sanitize';

describe('sanitizeInput', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('returns empty string for null/undefined', () => {
    expect(sanitizeInput(null as any)).toBe('');
    expect(sanitizeInput(undefined as any)).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  kip  ')).toBe('kip');
  });

  it('truncates to maxLength', () => {
    expect(sanitizeInput('abcdef', 3)).toBe('abc');
  });

  it('uses default maxLength of 100', () => {
    const long = 'a'.repeat(200);
    expect(sanitizeInput(long)).toHaveLength(100);
  });

  it('passes through normal ingredient strings', () => {
    expect(sanitizeInput('knoflook')).toBe('knoflook');
    expect(sanitizeInput('paprika poeder')).toBe('paprika poeder');
  });
});

describe('sanitizeIngredients', () => {
  it('filters out empty strings', () => {
    expect(sanitizeIngredients(['kip', '', 'zout'])).toEqual(['kip', 'zout']);
  });

  it('filters out non-strings', () => {
    expect(sanitizeIngredients(['kip', null as any, 42 as any])).toEqual(['kip']);
  });

  it('returns empty array for empty input', () => {
    expect(sanitizeIngredients([])).toEqual([]);
  });

  it('trims each ingredient', () => {
    expect(sanitizeIngredients(['  kip  ', ' zout'])).toEqual(['kip', 'zout']);
  });
});
