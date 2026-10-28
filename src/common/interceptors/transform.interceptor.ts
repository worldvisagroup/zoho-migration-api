import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { REQUEST_ID_HEADER } from '../constants/index.js';
import type { PaginatedResult, PaginationMeta, StandardApiResponse } from '../types/index.js';

function isPaginatedResult<T>(value: unknown): value is PaginatedResult<T> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.items) && typeof candidate.meta === 'object' && candidate.meta !== null
  );
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  StandardApiResponse<T> | StandardApiResponse<T[]>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardApiResponse<T> | StandardApiResponse<T[]>> {
    if (context.getType() !== 'http') {
      return next.handle() as Observable<StandardApiResponse<T>>;
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const rawRequestId = request.headers[REQUEST_ID_HEADER];
    const requestId = typeof rawRequestId === 'string' ? rawRequestId : 'unknown-request-id';
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      map((result: T): StandardApiResponse<T> | StandardApiResponse<T[]> => {
        const statusCode = response.statusCode;

        if (isPaginatedResult<T>(result)) {
          return {
            success: true,
            statusCode,
            data: result.items,
            meta: {
              timestamp,
              requestId,
              pagination: result.meta as PaginationMeta,
            },
          };
        }

        return {
          success: true,
          statusCode,
          data: result,
          meta: {
            timestamp,
            requestId,
          },
        };
      }),
    );
  }
}
