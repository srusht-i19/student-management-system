import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { JwtGuard } from "../auth/jwt.guard";
import { CreateStudentDto } from "./dto/create-student.dto";
import { IdParamDto } from "./dto/id-param.dto";
import { ListStudentsQueryDto } from "./dto/list-students-query.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { StudentsService } from "./students.service";

/**
 * Every input is validated before the method body runs (global ValidationPipe):
 *  - @Query()  -> ListStudentsQueryDto
 *  - @Param()  -> IdParamDto
 *  - @Body()   -> CreateStudentDto / UpdateStudentDto
 * Errors are thrown as Nest exceptions and formatted by AllExceptionsFilter.
 */
@Controller("students")
@UseGuards(JwtGuard)
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get()
  async findAll(
    @Query() query: ListStudentsQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { students, total } = await this.students.findAll(
      query.search,
      query.page,
      query.limit,
    );
    res.setHeader("X-Total-Count", String(total));
    return students;
  }

  @Get(":id")
  async findOne(@Param() { id }: IdParamDto) {
    return { student: await this.students.findOne(id) };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateStudentDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const student = await this.students.create(dto);
    res.location(`/api/students/${student.id}`);
    return { student };
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async update(@Param() { id }: IdParamDto, @Body() dto: UpdateStudentDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException("Provide at least one field to update");
    }
    return { student: await this.students.update(id, dto) };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  remove(@Param() { id }: IdParamDto) {
    return this.students.remove(id);
  }
}
