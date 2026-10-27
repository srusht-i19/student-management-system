import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import { QueryFailedError } from "typeorm";

/** Every error leaves the API in this one shape. */
export interface ErrorBody {
  statusCode: number;
  error: string;
  message: string[];
  path: string;
  timestamp: string;
}

// MySQL error codes we translate into client errors instead of a generic 500.
const MYSQL_DUPLICATE = "ER_DUP_ENTRY";
const MYSQL_BAD_DATA = [
  "ER_DATA_TOO_LONG",
  "ER_TRUNCATED_WRONG_VALUE",
  "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD",
  "ER_WARN_DATA_OUT_OF_RANGE",
  "ER_BAD_NULL_ERROR",
];

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger("Exceptions");

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const { statusCode, message } = this.normalize(exception);

    // Only unexpected failures are logged with a stack trace; client mistakes are not noise.
    if (statusCode >= 500) {
      this.logger.error(
        `${req.method} ${req.originalUrl}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ErrorBody = {
      statusCode,
      error: STATUS_CODES[statusCode] ?? "Error",
      message,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(body);
  }

  private normalize(exception: unknown): {
    statusCode: number;
    message: string[];
  } {
    // 1. Errors thrown by Nest (validation 400, guard 401, NotFound 404, Conflict 409, ...)
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const raw =
        typeof response === "string"
          ? response
          : (response as { message?: string | string[] }).message;
      const message = Array.isArray(raw) ? raw : [raw ?? exception.message];
      return { statusCode: exception.getStatus(), message };
    }

    // 2. Database errors that are really the client's fault
    if (exception instanceof QueryFailedError) {
      const code = (exception as unknown as { driverError?: { code?: string } })
        .driverError?.code;
      if (code === MYSQL_DUPLICATE) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: ["A record with this value already exists"],
        };
      }
      if (code && MYSQL_BAD_DATA.includes(code)) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ["One or more fields contain invalid data"],
        };
      }
    }

    // 3. MySQL is down or unreachable (e.g. AggregateError / ECONNREFUSED)
    const netCode = (exception as { code?: string })?.code;
    if (
      netCode === "ECONNREFUSED" ||
      netCode === "PROTOCOL_CONNECTION_LOST" ||
      (exception instanceof Error && exception.name === "AggregateError")
    ) {
      return {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: ["The database is unavailable. Please try again shortly."],
      };
    }

    // 4. Body-parser errors, e.g. malformed JSON in the request body
    const e = exception as { status?: number; type?: string };
    if (typeof e?.status === "number" && e.status >= 400 && e.status < 500) {
      return {
        statusCode: e.status,
        message: [
          e.type === "entity.parse.failed"
            ? "Malformed JSON in request body"
            : "Invalid request",
        ],
      };
    }

    // 5. Anything else: hide internals from the client
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ["Internal server error"],
    };
  }
}
