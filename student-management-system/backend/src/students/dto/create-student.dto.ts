import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { Gender, StudentStatus } from "../entities/student.entity";
import { Trim, TrimLowercase } from "../../common/transforms";
import { IsMinAge } from "./is-min-age.validator";

export class CreateStudentDto {
  @Trim()
  @IsString()
  @Length(2, 50, { message: "first_name must be 2-50 characters" })
  first_name: string;

  @Trim()
  @IsString()
  @Length(2, 50, { message: "last_name must be 2-50 characters" })
  last_name: string;

  @TrimLowercase()
  @IsEmail({}, { message: "email must be a valid email address" })
  @MaxLength(100)
  email: string;

  @IsOptional()
  @Trim()
  @Matches(/^\d{10}$/, { message: "phone must be exactly 10 digits" })
  phone?: string;

  @IsDateString(
    {},
    { message: "date_of_birth must be a valid ISO date (YYYY-MM-DD)" },
  )
  @IsMinAge(16)
  date_of_birth: string;

  @IsEnum(Gender, { message: "gender must be Male, Female or Other" })
  gender: Gender;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: "course is required" })
  @MaxLength(50)
  course: string;

  @IsInt({ message: "year must be a whole number" })
  @Min(1, { message: "year must be between 1 and 4" })
  @Max(4, { message: "year must be between 1 and 4" })
  year: number;

  @IsOptional()
  @IsEnum(StudentStatus, { message: "status must be Active or Inactive" })
  status?: StudentStatus;
}
