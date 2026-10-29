import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length, Matches, Max, MaxLength, Min } from 'class-validator';
import { Trim } from '../../common/transforms';
import { CourseStatus } from '../entities/course.entity';

export class CreateCourseDto {
  /** Short unique code, e.g. BTECH. Stored in upper case. */
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @Matches(/^[A-Z0-9_-]{2,20}$/, { message: 'code must be 2-20 letters, numbers, - or _' })
  code: string;

  @Trim()
  @IsString()
  @Length(2, 100, { message: 'name must be 2-100 characters' })
  name: string;

  @IsInt({ message: 'duration_years must be a whole number' })
  @Min(1, { message: 'duration_years must be between 1 and 6' })
  @Max(6, { message: 'duration_years must be between 1 and 6' })
  duration_years: number;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(500, { message: 'description must be at most 500 characters' })
  description?: string;

  @IsOptional()
  @IsEnum(CourseStatus, { message: 'status must be Active or Inactive' })
  status?: CourseStatus;
}
