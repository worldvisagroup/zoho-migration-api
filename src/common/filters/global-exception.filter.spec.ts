import { HttpException, HttpStatus } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import type { Request, Response } from 'express';
import { GlobalExceptionFilter } from './global-exception.filter.js';
import { AppLoggerService } from '../../logger/logger.service.js';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let logger: AppLoggerService;

  beforeEach(() => {
    logger = new AppLoggerService();
    filter = new GlobalExceptionFilter(logger);
  });

  it('should format HttpException into standard error envelope', () => {
    const jsonMock = vi.fn();
    const statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    const mockResponse = {
      status: statusMock,
    } as unknown as Response;

    const mockRequest = {
      method: 'GET',
      originalUrl: '/test',
      headers: { 'x-request-id': 'req-test-123' },
    } as unknown as Request;

    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('Resource not found', HttpStatus.NOT_FOUND);

    filter.catch(exception, mockHost);

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        error: expect.objectContaining({
          code: 'NOT_FOUND',
          message: 'Resource not found',
        }),
        meta: expect.objectContaining({
          requestId: 'req-test-123',
        }),
      }),
    );
  });
});
