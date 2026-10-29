import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ListQueryDto } from '../../common/list-view/list-query.dto';
import { Trim } from '../../common/transforms';
import { Gender, StudentStatus } from '../entities/student.entity';

/** Common list options (ListQueryDto) plus student-specific filters. */
export class ListStudentsQueryDto extends ListQueryDto {
  @IsOptional()
  @IsEnum(StudentStatus, { message: 'status must be Active or Inactive' })
  status?: StudentStatus;

  @IsOptional()
  @IsEnum(Gender, { message: 'gender must be Male, Female or Other' })
  gender?: Gender;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(50)
  course?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'year must be a whole number' })
  @Min(1, { message: 'year must be between 1 and 4' })
  @Max(4, { message: 'year must be between 1 and 4' })
  year?: number;
}
