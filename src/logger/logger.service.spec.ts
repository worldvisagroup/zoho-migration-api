import { AppLoggerService } from './logger.service.js';

describe('AppLoggerService', () => {
  let loggerService: AppLoggerService;

  beforeEach(() => {
    loggerService = new AppLoggerService();
  });

  it('should redact sensitive keys recursively in objects', () => {
    const sensitivePayload = {
      user: 'john_doe',
      password: 'superSecretPassword123',
      nested: {
        authorization: 'Bearer eyJhbGciOi...',
        apiKey: 'sk_live_12345',
        safeProperty: 'visible',
      },
      tags: ['crm', 'lead'],
    };

    const sanitized = loggerService.sanitizeData(sensitivePayload) as Record<string, unknown>;

    expect(sanitized.user).toBe('john_doe');
    expect(sanitized.password).toBe('[REDACTED]');

    const nested = sanitized.nested as Record<string, unknown>;
    expect(nested.authorization).toBe('[REDACTED]');
    expect(nested.apiKey).toBe('[REDACTED]');
    expect(nested.safeProperty).toBe('visible');
  });

  it('should preserve primitive non-sensitive values and arrays', () => {
    expect(loggerService.sanitizeData('test')).toBe('test');
    expect(loggerService.sanitizeData(123)).toBe(123);
    expect(loggerService.sanitizeData(null)).toBeNull();
    expect(loggerService.sanitizeData(undefined)).toBeUndefined();
  });
});
