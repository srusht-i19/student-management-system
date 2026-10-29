import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

/**
 * Runs for every request BEFORE guards, pipes and controllers.
 *  1. Gives each request an id (X-Request-Id header) so one request can be traced in the logs.
 *  2. Logs "METHOD url status duration" once the response has been sent.
 * Request bodies are never logged (they can contain passwords).
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // Accept a client-supplied id only if it is short and harmless.
    const incoming = req.headers['x-request-id'];
    const requestId =
      typeof incoming === 'string' && /^[\w-]{1,64}$/.test(incoming) ? incoming : randomUUID();
    res.setHeader('X-Request-Id', requestId);

    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      const line = `${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(0)}ms [${requestId}]`;
      if (res.statusCode >= 500) this.logger.error(line);
      else if (res.statusCode >= 400) this.logger.warn(line);
      else this.logger.log(line);
    });

    next();
  }
}
