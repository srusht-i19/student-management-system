import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/** Documents the error responses every protected CRUD controller can return. */
export const ApiStandardErrors = () =>
  applyDecorators(
    ApiBadRequestResponse({ description: 'Validation failed (message lists every problem)' }),
    ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token' }),
    ApiNotFoundResponse({ description: 'Record not found (or soft-deleted)' }),
    ApiConflictResponse({ description: 'A record with this unique value already exists' }),
  );
