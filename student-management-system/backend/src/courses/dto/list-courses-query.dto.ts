import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ListQueryDto } from '../../common/list-view/list-query.dto';
import { CourseStatus } from '../entities/course.entity';

/** ?search= ?page= ?limit= ?sort_by= ?sort_order= (from ListQueryDto) plus these filters. */
export class ListCoursesQueryDto extends ListQueryDto {
  @IsOptional()
  @IsEnum(CourseStatus, { message: 'status must be Active or Inactive' })
  status?: CourseStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'duration_years must be a whole number' })
  @Min(1)
  @Max(6)
  duration_years?: number;
}
