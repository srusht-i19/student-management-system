import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';
import { Trim, TrimLowercase } from '../../common/transforms';
import { TeacherStatus } from '../entities/teacher.entity';

export class CreateTeacherDto {
  @Trim()
  @IsString()
  @Length(2, 50, { message: 'first_name must be 2-50 characters' })
  first_name: string;

  @Trim()
  @IsString()
  @Length(2, 50, { message: 'last_name must be 2-50 characters' })
  last_name: string;

  @TrimLowercase()
  @IsEmail({}, { message: 'email must be a valid email address' })
  @MaxLength(100)
  email: string;

  @IsOptional()
  @Trim()
  @Matches(/^\d{10}$/, { message: 'phone must be exactly 10 digits' })
  phone?: string;

  @Trim()
  @IsString()
  @Length(2, 100, { message: 'department must be 2-100 characters' })
  department: string;

  @Trim()
  @IsString()
  @Length(2, 100, { message: 'designation must be 2-100 characters' })
  designation: string;

  @IsOptional()
  @IsEnum(TeacherStatus, { message: 'status must be Active or Inactive' })
  status?: TeacherStatus;
}
