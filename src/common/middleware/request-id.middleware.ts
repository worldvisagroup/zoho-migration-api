import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { REQUEST_ID_HEADER } from '../constants/index.js';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const rawHeader = req.headers[REQUEST_ID_HEADER];
    let requestId: string;

    if (typeof rawHeader === 'string' && rawHeader.trim().length > 0) {
      requestId = rawHeader.trim();
    } else if (Array.isArray(rawHeader) && rawHeader[0] && rawHeader[0].trim().length > 0) {
      requestId = rawHeader[0].trim();
    } else {
      requestId = uuidv4();
    }

    req.headers[REQUEST_ID_HEADER] = requestId;
    res.setHeader(REQUEST_ID_HEADER, requestId);

    next();
  }
}
