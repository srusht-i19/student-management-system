import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ApiStandardErrors } from '../common/swagger/api-standard-errors.decorator';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { IdParamDto } from './dto/id-param.dto';
import { ListStudentsQueryDto } from './dto/list-students-query.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

/**
 * Every input is validated before the method body runs (global ValidationPipe):
 *  - @Query()  -> ListStudentsQueryDto
 *  - @Param()  -> IdParamDto
 *  - @Body()   -> CreateStudentDto / UpdateStudentDto
 * Errors are thrown as Nest exceptions and formatted by AllExceptionsFilter.
 */
@ApiTags('Students')
@ApiBearerAuth()
@ApiStandardErrors()
@Controller('students')
@UseGuards(JwtGuard)
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'List students (search, filter, sort, paginate). Returns an array; total is in the X-Total-Count header' })
  async findAll(
    @Query() query: ListStudentsQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, meta } = await this.students.findAll(query);
    res.setHeader('X-Total-Count', String(meta.total));
    return data; // plain array keeps the current frontend working
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one student' })
  async findOne(@Param() { id }: IdParamDto) {
    return { student: await this.students.findOne(id) };
  }

  @Post()
  @ApiOperation({ summary: 'Create a student' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateStudentDto, @Res({ passthrough: true }) res: Response) {
    const student = await this.students.create(dto);
    res.location(`/api/students/${student.id}`);
    return { student };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a student (full or partial)' })
  @HttpCode(HttpStatus.OK)
  async update(@Param() { id }: IdParamDto, @Body() dto: UpdateStudentDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Provide at least one field to update');
    }
    return { student: await this.students.update(id, dto) };
  }

  /** Soft delete: sets is_deleted = 1, the row is kept in the database. */
  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a student (is_deleted = 1)' })
  @HttpCode(HttpStatus.OK)
  remove(@Param() { id }: IdParamDto) {
    return this.students.remove(id);
  }

  /** Undo a soft delete. */
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted student' })
  @HttpCode(HttpStatus.OK)
  async restore(@Param() { id }: IdParamDto) {
    return { student: await this.students.restore(id) };
  }
}
