import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { REQUEST_ID_HEADER } from '../constants/index.js';
import { AppLoggerService } from '../../logger/logger.service.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') ?? 'unknown';
    const requestId =
      typeof request.headers[REQUEST_ID_HEADER] === 'string'
        ? request.headers[REQUEST_ID_HEADER]
        : 'unknown-request-id';

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          this.logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`, 'HTTP', {
            requestId,
            method,
            url: originalUrl,
            statusCode,
            durationMs: duration,
            ip,
            userAgent,
          });
        },
        error: (err: unknown) => {
          const duration = Date.now() - startTime;
          const message = err instanceof Error ? err.message : 'Unknown error';

          this.logger.warn(`${method} ${originalUrl} FAILED - ${duration}ms - ${message}`, 'HTTP', {
            requestId,
            method,
            url: originalUrl,
            durationMs: duration,
            ip,
            userAgent,
            errorMessage: message,
          });
        },
      }),
    );
  }
}
