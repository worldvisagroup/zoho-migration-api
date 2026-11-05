import { describe, expect, it } from 'vitest';
import { normalizeMeetingStatus } from './meeting-status.util.js';

describe('normalizeMeetingStatus', () => {
  it('should return "ended" when Meeting_Status is "Attended", regardless of is_closed', () => {
    expect(normalizeMeetingStatus('Attended', true)).toBe('ended');
    expect(normalizeMeetingStatus('attended', false)).toBe('ended');
  });

  it('should return "cancelled" when Meeting_Status is "Escaped", "Postponed", or "Cancelled"', () => {
    expect(normalizeMeetingStatus('Escaped', true)).toBe('cancelled');
    expect(normalizeMeetingStatus('escaped', false)).toBe('cancelled');
    expect(normalizeMeetingStatus('Postponed', true)).toBe('cancelled');
    expect(normalizeMeetingStatus('postponed', false)).toBe('cancelled');
    expect(normalizeMeetingStatus('Cancelled', true)).toBe('cancelled');
    expect(normalizeMeetingStatus('canceled', true)).toBe('cancelled');
  });

  it('should return "scheduled" when Meeting_Status is null and is_closed is false', () => {
    expect(normalizeMeetingStatus(null, false)).toBe('scheduled');
    expect(normalizeMeetingStatus('', false)).toBe('scheduled');
    expect(normalizeMeetingStatus(undefined, false)).toBe('scheduled');
  });

  it('should return "ended" when Meeting_Status is null/empty and is_closed is true', () => {
    expect(normalizeMeetingStatus(null, true)).toBe('ended');
    expect(normalizeMeetingStatus('', true)).toBe('ended');
    expect(normalizeMeetingStatus(undefined, true)).toBe('ended');
  });

  it('should default to "ended" if is_closed is true or undefined with no status', () => {
    expect(normalizeMeetingStatus(null, true)).toBe('ended');
    expect(normalizeMeetingStatus(null, undefined)).toBe('ended');
  });
});
