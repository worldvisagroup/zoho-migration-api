import { describe, expect, it } from 'vitest';
import { normalizeTaskStatus } from './task-status.util.js';

describe('normalizeTaskStatus', () => {
  it('should return "done" when is_closed is true, even if Status is "In Progress"', () => {
    expect(normalizeTaskStatus('In Progress', true)).toBe('done');
    expect(normalizeTaskStatus('Not Started', true)).toBe('done');
    expect(normalizeTaskStatus('Completed', true)).toBe('done');
    expect(normalizeTaskStatus(null, true)).toBe('done');
  });

  it('should return "done" when Status is "Completed", "Closed", or "Done", even if is_closed is false', () => {
    expect(normalizeTaskStatus('Completed', false)).toBe('done');
    expect(normalizeTaskStatus('completed', false)).toBe('done');
    expect(normalizeTaskStatus('Closed', false)).toBe('done');
    expect(normalizeTaskStatus('done', false)).toBe('done');
  });

  it('should return "in_progress" when Status is "In Progress", "in_progress", or "in-progress" and is_closed is false', () => {
    expect(normalizeTaskStatus('In Progress', false)).toBe('in_progress');
    expect(normalizeTaskStatus('in progress', false)).toBe('in_progress');
    expect(normalizeTaskStatus('in_progress', false)).toBe('in_progress');
    expect(normalizeTaskStatus('in-progress', false)).toBe('in_progress');
  });

  it('should return "todo" for open, waiting, deferred, or unknown statuses', () => {
    expect(normalizeTaskStatus('Not Started', false)).toBe('todo');
    expect(normalizeTaskStatus('Waiting on someone else', false)).toBe('todo');
    expect(normalizeTaskStatus('Waiting for input', false)).toBe('todo');
    expect(normalizeTaskStatus('Deferred', false)).toBe('todo');
    expect(normalizeTaskStatus('', false)).toBe('todo');
    expect(normalizeTaskStatus(null, false)).toBe('todo');
    expect(normalizeTaskStatus(undefined, undefined)).toBe('todo');
    expect(normalizeTaskStatus('Unknown Status', false)).toBe('todo');
  });
});
