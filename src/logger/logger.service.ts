import { Injectable, type LoggerService } from '@nestjs/common';
import { SENSITIVE_LOG_KEYS } from '../common/constants/index.js';

export interface StructuredLogPayload {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
  stack?: string;
}

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly isProduction = process.env.NODE_ENV === 'production';

  log(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.printLog('INFO', message, context, metadata);
  }

  error(
    message: string,
    trace?: string,
    context?: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.printLog('ERROR', message, context, metadata, trace);
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.printLog('WARN', message, context, metadata);
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (!this.isProduction) {
      this.printLog('DEBUG', message, context, metadata);
    }
  }

  verbose(message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (!this.isProduction) {
      this.printLog('VERBOSE', message, context, metadata);
    }
  }

  public sanitizeData(data: unknown): unknown {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: Record<string, unknown> = {};
    const record = data as Record<string, unknown>;

    for (const [key, value] of Object.entries(record)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = SENSITIVE_LOG_KEYS.some(k => lowerKey.includes(k));

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private printLog(
    level: string,
    message: string,
    context?: string,
    metadata?: Record<string, unknown>,
    stack?: string,
  ): void {
    const payload: StructuredLogPayload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context ?? 'Application',
    };

    if (metadata) {
      const sanitized = this.sanitizeData(metadata);
      if (typeof sanitized === 'object' && sanitized !== null) {
        payload.metadata = sanitized as Record<string, unknown>;
      }
    }

    if (stack) {
      payload.stack = stack;
    }

    if (this.isProduction) {
      const jsonOutput = JSON.stringify(payload);
      if (level === 'ERROR') {
        process.stderr.write(`${jsonOutput}\n`);
      } else {
        process.stdout.write(`${jsonOutput}\n`);
      }
    } else {
      const contextTag = payload.context ? `[${payload.context}] ` : '';
      const metaStr = payload.metadata ? ` | Meta: ${JSON.stringify(payload.metadata)}` : '';
      const formatted = `[${payload.timestamp}] ${payload.level.padEnd(5)} ${contextTag}${payload.message}${metaStr}`;

      if (level === 'ERROR') {
        process.stderr.write(`${formatted}\n`);
        if (stack) {
          process.stderr.write(`${stack}\n`);
        }
      } else if (level === 'WARN') {
        process.stderr.write(`${formatted}\n`);
      } else {
        process.stdout.write(`${formatted}\n`);
      }
    }
  }
}
