import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Trim } from '../transforms';

/** Query-string options shared by every list endpoint. Module DTOs extend this to add filters. */
export class ListQueryDto {
  /** Free-text search across the module's search fields. */
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(100, { message: 'search must be at most 100 characters' })
  search?: string;

  /** Page number, starting at 1. */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be a whole number' })
  @Min(1, { message: 'page must be 1 or greater' })
  page?: number;

  /** Rows per page (1-100). */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be a whole number' })
  @Min(1, { message: 'limit must be between 1 and 100' })
  @Max(100, { message: 'limit must be between 1 and 100' })
  limit?: number;

  /** Column to sort by (must be one of the module's sortable fields). */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sort_by?: string;

  /** Sort direction. */
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase() : value))
  @IsIn(['ASC', 'DESC'], { message: 'sort_order must be ASC or DESC' })
  sort_order?: 'ASC' | 'DESC';
}
