import { describe, expect, it } from 'vitest';
import { resolveCallStatus } from './call-status.util.js';

describe('resolveCallStatus', () => {
  const mockNow = new Date('2026-11-23T12:00:00.000Z');
  const futureDate = new Date('2026-11-25T10:00:00.000Z');
  const pastDate = new Date('2026-11-20T10:00:00.000Z');

  describe('Duration > 0 priority', () => {
    it('should return answered whenever duration is greater than 0, regardless of status', () => {
      expect(resolveCallStatus(120, 'Completed', pastDate, mockNow)).toBe('answered');
      expect(resolveCallStatus(1, 'Cancelled', pastDate, mockNow)).toBe('answered');
      expect(resolveCallStatus(45, 'Overdue', pastDate, mockNow)).toBe('answered');
      expect(resolveCallStatus(60, 'Scheduled', futureDate, mockNow)).toBe('answered');
      expect(resolveCallStatus(15, null, pastDate, mockNow)).toBe('answered');
      expect(resolveCallStatus(30, '', pastDate, mockNow)).toBe('answered');
    });
  });

  describe('Duration <= 0 or null with Completed status', () => {
    it('should return answered when status is Completed and duration is 0', () => {
      expect(resolveCallStatus(0, 'Completed', pastDate, mockNow)).toBe('answered');
      expect(resolveCallStatus(0, 'completed', pastDate, mockNow)).toBe('answered');
      expect(resolveCallStatus(0, '  Completed  ', pastDate, mockNow)).toBe('answered');
    });

    it('should return answered when status is Completed and duration is null or undefined', () => {
      expect(resolveCallStatus(null, 'Completed', pastDate, mockNow)).toBe('answered');
      expect(resolveCallStatus(undefined, 'Completed', pastDate, mockNow)).toBe('answered');
      expect(resolveCallStatus(-5, 'Completed', pastDate, mockNow)).toBe('answered');
    });
  });

  describe('Duration <= 0 or null with Overdue status', () => {
    it('should return overdue when status is Overdue', () => {
      expect(resolveCallStatus(0, 'Overdue', pastDate, mockNow)).toBe('overdue');
      expect(resolveCallStatus(null, 'overdue', pastDate, mockNow)).toBe('overdue');
      expect(resolveCallStatus(undefined, '  Overdue  ', pastDate, mockNow)).toBe('overdue');
    });
  });

  describe('Duration <= 0 or null with Cancelled status', () => {
    it('should return cancelled when status is Cancelled or Canceled', () => {
      expect(resolveCallStatus(0, 'Cancelled', pastDate, mockNow)).toBe('cancelled');
      expect(resolveCallStatus(null, 'cancelled', pastDate, mockNow)).toBe('cancelled');
      expect(resolveCallStatus(0, 'Canceled', pastDate, mockNow)).toBe('cancelled');
      expect(resolveCallStatus(null, 'canceled', pastDate, mockNow)).toBe('cancelled');
      expect(resolveCallStatus(0, '  Cancelled  ', pastDate, mockNow)).toBe('cancelled');
    });
  });

  describe('Duration <= 0 or null with Scheduled status', () => {
    it('should return scheduled when date is in the future', () => {
      expect(resolveCallStatus(0, 'Scheduled', futureDate, mockNow)).toBe('scheduled');
      expect(resolveCallStatus(null, 'scheduled', '2026-11-25T10:00:00.000Z', mockNow)).toBe('scheduled');
    });

    it('should return overdue when date has passed or is equal to now', () => {
      expect(resolveCallStatus(0, 'Scheduled', pastDate, mockNow)).toBe('overdue');
      expect(resolveCallStatus(null, 'Scheduled', mockNow, mockNow)).toBe('overdue');
      expect(resolveCallStatus(0, 'Scheduled', '2026-11-20T10:00:00.000Z', mockNow)).toBe('overdue');
    });

    it('should return overdue when date is missing or invalid', () => {
      expect(resolveCallStatus(0, 'Scheduled', null, mockNow)).toBe('overdue');
      expect(resolveCallStatus(0, 'Scheduled', undefined, mockNow)).toBe('overdue');
      expect(resolveCallStatus(0, 'Scheduled', 'invalid-date', mockNow)).toBe('overdue');
    });
  });

  describe('Duration <= 0 or null with null/empty status', () => {
    it('should return scheduled when date is in the future', () => {
      expect(resolveCallStatus(0, null, futureDate, mockNow)).toBe('scheduled');
      expect(resolveCallStatus(null, undefined, futureDate, mockNow)).toBe('scheduled');
      expect(resolveCallStatus(0, '', futureDate, mockNow)).toBe('scheduled');
      expect(resolveCallStatus(0, '   ', futureDate, mockNow)).toBe('scheduled');
    });

    it('should return overdue when date has passed, equal to now, or missing', () => {
      expect(resolveCallStatus(0, null, pastDate, mockNow)).toBe('overdue');
      expect(resolveCallStatus(null, null, mockNow, mockNow)).toBe('overdue');
      expect(resolveCallStatus(0, null, null, mockNow)).toBe('overdue');
      expect(resolveCallStatus(0, '', undefined, mockNow)).toBe('overdue');
      expect(resolveCallStatus(0, null, 'invalid-date', mockNow)).toBe('overdue');
    });
  });
});
