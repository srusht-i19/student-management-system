import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

/** Validates the :id route parameter. */
export class IdParamDto {
  @Type(() => Number)
  @IsInt({ message: 'id must be a whole number' })
  @Min(1, { message: 'id must be 1 or greater' })
  id: number;
}
