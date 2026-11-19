import type { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiKeyGuard } from './api-key.guard.js';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let reflector: Reflector;
  let configService: ConfigService;

  const validKey = 'wv_test_key_12345';

  beforeEach(() => {
    reflector = {
      getAllAndOverride: vi.fn(),
    } as unknown as Reflector;

    configService = {
      get: vi.fn((key: string) => {
        if (key === 'security.apiKey') return validKey;
        return undefined;
      }),
    } as unknown as ConfigService;

    guard = new ApiKeyGuard(reflector, configService);
  });

  function createMockContext(headers: Record<string, string | string[] | undefined> = {}): ExecutionContext {
    return {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
    } as unknown as ExecutionContext;
  }

  it('should allow access when endpoint is marked with @Public()', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const context = createMockContext();

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when x-api-key matches configured key', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const context = createMockContext({ 'x-api-key': validKey });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should handle x-api-key as array (taking first value)', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const context = createMockContext({ 'x-api-key': [validKey, 'another'] });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw UnauthorizedException when x-api-key header is missing', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const context = createMockContext({});

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('Invalid or missing API key in x-api-key header');
  });

  it('should throw UnauthorizedException when x-api-key is invalid', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const context = createMockContext({ 'x-api-key': 'wrong_key' });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('Invalid or missing API key in x-api-key header');
  });
});
