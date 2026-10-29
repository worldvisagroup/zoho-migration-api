import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { REQUEST_ID_HEADER } from '../constants/index.js';
import { BYPASS_TRANSFORM_KEY } from '../decorators/bypass-transform.decorator.js';
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
  StandardApiResponse<T> | StandardApiResponse<T[]> | T
> {
  constructor(private readonly reflector?: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardApiResponse<T> | StandardApiResponse<T[]> | T> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const isBypassed = this.reflector?.getAllAndOverride<boolean>(BYPASS_TRANSFORM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isBypassed) {
      return next.handle();
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
