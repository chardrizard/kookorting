import { describe, it, expect } from 'vitest';
import { validateServingInfo, generateUserMessage } from './validation';

describe('validateServingInfo', () => {
  it('clamps adults to minimum of 1', () => {
    expect(validateServingInfo(0, 0).adults).toBe(1);
    expect(validateServingInfo(-5, 0).adults).toBe(1);
  });

  it('clamps adults to maximum of 10', () => {
    expect(validateServingInfo(11, 0).adults).toBe(10);
    expect(validateServingInfo(100, 0).adults).toBe(10);
  });

  it('clamps kids to minimum of 0', () => {
    expect(validateServingInfo(2, -1).kids).toBe(0);
  });

  it('clamps kids to maximum of 10', () => {
    expect(validateServingInfo(2, 15).kids).toBe(10);
  });

  it('passes valid values through unchanged', () => {
    expect(validateServingInfo(2, 3)).toEqual({ adults: 2, kids: 3 });
  });
});

describe('generateUserMessage', () => {
  it('includes protein and cuisine', () => {
    const msg = generateUserMessage('Kipfilet', 'Italiaans', [], 2, 0, []);
    expect(msg).toContain('Kipfilet');
    expect(msg).toContain('Italiaans');
  });

  it('shows "None" when no extra ingredients', () => {
    const msg = generateUserMessage('Kip', 'Thai', [], 1, 0, []);
    expect(msg).toContain('None');
  });

  it('lists extra ingredients when provided', () => {
    const msg = generateUserMessage('Kip', 'Thai', [], 1, 0, ['paprika', 'ui']);
    expect(msg).toContain('paprika');
    expect(msg).toContain('ui');
  });

  it('includes portions correctly', () => {
    const msg = generateUserMessage('Kip', 'Thai', [], 3, 2, []);
    expect(msg).toContain('3 adults');
    expect(msg).toContain('2 children');
  });

  it('truncates extra ingredients to 100 chars each', () => {
    const long = 'a'.repeat(200);
    const msg = generateUserMessage('Kip', 'Thai', [], 1, 0, [long]);
    // The ingredient should be truncated, not the full 200 chars
    expect(msg.includes(long)).toBe(false);
  });
});
