import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import {
  FILTER_COLLISION_ERROR_MESSAGE,
  validateDateFilterExclusivity,
} from './filter-collision.util.js';

describe('validateDateFilterExclusivity', () => {
  it('should pass when only updatedSince is provided', () => {
    expect(() =>
      validateDateFilterExclusivity({ updatedSince: '2024-01-01T00:00:00Z' }),
    ).not.toThrow();
  });

  it('should pass when only from is provided', () => {
    expect(() =>
      validateDateFilterExclusivity({ from: '2024-01-01T00:00:00Z' }),
    ).not.toThrow();
  });

  it('should pass when only to is provided', () => {
    expect(() =>
      validateDateFilterExclusivity({ to: '2024-12-31T23:59:59Z' }),
    ).not.toThrow();
  });

  it('should pass when both from and to are provided without updatedSince', () => {
    expect(() =>
      validateDateFilterExclusivity({
        from: '2024-01-01T00:00:00Z',
        to: '2024-12-31T23:59:59Z',
      }),
    ).not.toThrow();
  });

  it('should pass when none of the date filters are provided', () => {
    expect(() => validateDateFilterExclusivity({})).not.toThrow();
  });

  it('should throw BadRequestException when updatedSince is provided alongside from', () => {
    expect(() =>
      validateDateFilterExclusivity({
        updatedSince: '2024-01-01T00:00:00Z',
        from: '2024-01-01T00:00:00Z',
      }),
    ).toThrow(BadRequestException);

    try {
      validateDateFilterExclusivity({
        updatedSince: '2024-01-01T00:00:00Z',
        from: '2024-01-01T00:00:00Z',
      });
    } catch (err: unknown) {
      expect((err as BadRequestException).message).toBe(FILTER_COLLISION_ERROR_MESSAGE);
    }
  });

  it('should throw BadRequestException when updatedSince is provided alongside to', () => {
    expect(() =>
      validateDateFilterExclusivity({
        updatedSince: '2024-01-01T00:00:00Z',
        to: '2024-12-31T23:59:59Z',
      }),
    ).toThrow(BadRequestException);

    try {
      validateDateFilterExclusivity({
        updatedSince: '2024-01-01T00:00:00Z',
        to: '2024-12-31T23:59:59Z',
      });
    } catch (err: unknown) {
      expect((err as BadRequestException).message).toBe(FILTER_COLLISION_ERROR_MESSAGE);
    }
  });

  it('should throw BadRequestException when updatedSince is provided alongside both from and to', () => {
    expect(() =>
      validateDateFilterExclusivity({
        updatedSince: '2024-01-01T00:00:00Z',
        from: '2024-01-01T00:00:00Z',
        to: '2024-12-31T23:59:59Z',
      }),
    ).toThrow(BadRequestException);
  });
});
