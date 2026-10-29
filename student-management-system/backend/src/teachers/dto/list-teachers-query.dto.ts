import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ListQueryDto } from '../../common/list-view/list-query.dto';
import { Trim } from '../../common/transforms';
import { TeacherStatus } from '../entities/teacher.entity';

/** Common list options (ListQueryDto) plus teacher-specific filters. */
export class ListTeachersQueryDto extends ListQueryDto {
  @IsOptional()
  @IsEnum(TeacherStatus, { message: 'status must be Active or Inactive' })
  status?: TeacherStatus;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(100)
  department?: string;
}
