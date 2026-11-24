import { describe, expect, it } from 'vitest';
import { resolveTaskCompletedAt } from './task-completed-at.util.js';

describe('resolveTaskCompletedAt', () => {
  it('should return null when isDone is false even if closedTime exists', () => {
    const result = resolveTaskCompletedAt(
      false,
      '2024-03-05T12:00:00.000Z',
      '2024-03-05T12:00:00.000Z',
      '2024-03-01T10:00:00.000Z',
    );
    expect(result).toBeNull();
  });

  it('should return null when isDone is true but closedTime is missing or null', () => {
    expect(
      resolveTaskCompletedAt(true, null, '2024-03-05T12:00:00.000Z', '2024-03-01T10:00:00.000Z'),
    ).toBeNull();
    expect(
      resolveTaskCompletedAt(true, undefined, '2024-03-05T12:00:00.000Z', '2024-03-01T10:00:00.000Z'),
    ).toBeNull();
  });

  it('should return null when closedTime is an invalid date string', () => {
    const result = resolveTaskCompletedAt(
      true,
      'invalid-date',
      '2024-03-05T12:00:00.000Z',
      '2024-03-01T10:00:00.000Z',
    );
    expect(result).toBeNull();
  });

  it('should return closedTime when closedTime is greater than or equal to createdTime', () => {
    const result = resolveTaskCompletedAt(
      true,
      new Date('2024-03-05T11:45:00.000Z'),
      new Date('2024-03-05T12:00:00.000Z'),
      new Date('2024-03-01T10:00:00.000Z'),
    );
    expect(result).toBe('2024-03-05T11:45:00.000Z');
  });

  it('should return modifiedTime when closedTime is less than createdTime (anomaly) and modifiedTime exists', () => {
    const result = resolveTaskCompletedAt(
      true,
      '2024-02-28T09:00:00.000Z', // closed before created!
      '2024-03-03T15:00:00.000Z', // modified
      '2024-03-01T10:00:00.000Z', // created
    );
    expect(result).toBe('2024-03-03T15:00:00.000Z');
  });

  it('should return createdTime when closedTime is less than createdTime (anomaly) and modifiedTime is missing', () => {
    const result = resolveTaskCompletedAt(
      true,
      '2024-02-28T09:00:00.000Z', // closed before created!
      null,
      '2024-03-01T10:00:00.000Z', // created
    );
    expect(result).toBe('2024-03-01T10:00:00.000Z');
  });

  it('should return createdTime when closedTime is less than createdTime (anomaly) and modifiedTime is invalid date', () => {
    const result = resolveTaskCompletedAt(
      true,
      '2024-02-28T09:00:00.000Z',
      'not-a-date',
      '2024-03-01T10:00:00.000Z',
    );
    expect(result).toBe('2024-03-01T10:00:00.000Z');
  });
});
