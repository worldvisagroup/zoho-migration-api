import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ERROR_CODES, REQUEST_ID_HEADER } from '../constants/index.js';
import type { StandardApiError } from '../types/index.js';
import { AppLoggerService } from '../../logger/logger.service.js';

interface MongooseErrorShape {
  name: string;
  code?: number;
  message: string;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

function isMongooseError(error: unknown): error is MongooseErrorShape {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const candidate = error as Record<string, unknown>;
  return (
    candidate.name === 'CastError' ||
    candidate.name === 'ValidationError' ||
    candidate.name === 'MongoServerError' ||
    candidate.code === 11000
  );
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const rawRequestId = request.headers[REQUEST_ID_HEADER];
    const requestId = typeof rawRequestId === 'string' ? rawRequestId : 'unknown-request-id';
    const timestamp = new Date().toISOString();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: string = ERROR_CODES.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected internal error occurred';
    let details: string[] | Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errorCode = this.mapStatusToErrorCode(statusCode);
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        const rawMessage = responseObj.message;

        if (Array.isArray(rawMessage)) {
          message = 'Validation failed';
          errorCode = ERROR_CODES.VALIDATION_FAILED;
          details = rawMessage.map(item => String(item));
        } else if (typeof rawMessage === 'string') {
          message = rawMessage;
          errorCode =
            typeof responseObj.error === 'string'
              ? responseObj.error.toUpperCase().replace(/\s+/g, '_')
              : this.mapStatusToErrorCode(statusCode);
        }

        if (responseObj.details && Array.isArray(responseObj.details)) {
          details = responseObj.details.map(item => String(item));
        }
      }
    } else if (isMongooseError(exception)) {
      if (exception.code === 11000) {
        statusCode = HttpStatus.CONFLICT;
        errorCode = ERROR_CODES.CONFLICT;
        const duplicateField = exception.keyValue ? Object.keys(exception.keyValue)[0] : 'field';
        message = `Resource with this ${duplicateField} already exists`;
        details = [`Duplicate value detected for key '${duplicateField}'`];
      } else if (exception.name === 'CastError') {
        statusCode = HttpStatus.BAD_REQUEST;
        errorCode = ERROR_CODES.BAD_REQUEST;
        message = 'Invalid identifier or data type format';
      } else if (exception.name === 'ValidationError' && exception.errors) {
        statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        errorCode = ERROR_CODES.UNPROCESSABLE_ENTITY;
        message = 'Database schema validation constraint failed';
        details = Object.values(exception.errors).map(err => err.message);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorPayload: StandardApiError = {
      success: false,
      statusCode,
      error: {
        code: errorCode,
        message,
        ...(details ? { details } : {}),
      },
      meta: {
        timestamp,
        requestId,
      },
    };

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(
        `Unhandled Exception on ${request.method} ${request.originalUrl}: ${message}`,
        stack,
        'GlobalExceptionFilter',
        {
          requestId,
          url: request.originalUrl,
          method: request.method,
          statusCode,
        },
      );
    }

    response.status(statusCode).json(errorPayload);
  }

  private mapStatusToErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ERROR_CODES.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ERROR_CODES.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ERROR_CODES.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ERROR_CODES.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ERROR_CODES.CONFLICT;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return ERROR_CODES.UNPROCESSABLE_ENTITY;
      case HttpStatus.TOO_MANY_REQUESTS:
        return ERROR_CODES.TOO_MANY_REQUESTS;
      default:
        return ERROR_CODES.INTERNAL_SERVER_ERROR;
    }
  }
}
