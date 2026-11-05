import { describe, expect, it } from 'vitest';
import { normalizeTaskPriority } from './task-priority.util.js';

describe('normalizeTaskPriority', () => {
  it('should map Highest to urgent', () => {
    expect(normalizeTaskPriority('Highest')).toBe('urgent');
    expect(normalizeTaskPriority('highest')).toBe('urgent');
  });

  it('should map High to high', () => {
    expect(normalizeTaskPriority('High')).toBe('high');
    expect(normalizeTaskPriority('high')).toBe('high');
  });

  it('should map Normal to medium', () => {
    expect(normalizeTaskPriority('Normal')).toBe('medium');
    expect(normalizeTaskPriority('normal')).toBe('medium');
  });

  it('should map Low and Lowest to low', () => {
    expect(normalizeTaskPriority('Low')).toBe('low');
    expect(normalizeTaskPriority('Lowest')).toBe('low');
  });

  it('should default to medium for missing, empty, or unknown priorities', () => {
    expect(normalizeTaskPriority(null)).toBe('medium');
    expect(normalizeTaskPriority(undefined)).toBe('medium');
    expect(normalizeTaskPriority('')).toBe('medium');
    expect(normalizeTaskPriority('Critical')).toBe('medium');
  });
});
