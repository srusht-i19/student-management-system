import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Trim } from '../../common/transforms';

/** Validates ?search=, ?page= and ?limit= on GET /api/students. */
export class ListStudentsQueryDto {
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(100, { message: 'search must be at most 100 characters' })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be a whole number' })
  @Min(1, { message: 'page must be 1 or greater' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be a whole number' })
  @Min(1, { message: 'limit must be between 1 and 100' })
  @Max(100, { message: 'limit must be between 1 and 100' })
  limit?: number;
}
