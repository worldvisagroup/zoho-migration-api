import { Environment, LogLevel, validateEnvironment } from './env.validation.js';

describe('validateEnvironment', () => {
  it('should pass with valid and default environment variables', () => {
    const config = {
      NODE_ENV: 'development',
      PORT: '5050',
      MONGODB_URI: 'mongodb://localhost:27017/zoho_crm',
      MONGODB_DB_NAME: 'zoho_crm',
      LOG_LEVEL: 'log',
    };

    const validated = validateEnvironment(config);

    expect(validated.NODE_ENV).toBe(Environment.Development);
    expect(validated.PORT).toBe(5050);
    expect(validated.MONGODB_URI).toBe('mongodb://localhost:27017/zoho_crm');
    expect(validated.LOG_LEVEL).toBe(LogLevel.Log);
  });

  it('should throw an error when an invalid PORT is provided', () => {
    const config = {
      PORT: '999999',
    };

    expect(() => validateEnvironment(config)).toThrow('Environment validation failed');
  });

  it('should throw an error when an invalid NODE_ENV is provided', () => {
    const config = {
      NODE_ENV: 'invalid_env',
    };

    expect(() => validateEnvironment(config)).toThrow('Environment validation failed');
  });
});
