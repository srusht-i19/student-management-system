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
import { JwtGuard } from '../auth/jwt.guard';
import { ApiStandardErrors } from '../common/swagger/api-standard-errors.decorator';
import { IdParamDto } from '../students/dto/id-param.dto';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { ListCoursesQueryDto } from './dto/list-courses-query.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Courses')
@ApiBearerAuth()
@ApiStandardErrors()
@Controller('courses')
@UseGuards(JwtGuard)
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'List courses (search, filter, sort, paginate)' })
  findAll(@Query() query: ListCoursesQueryDto) {
    return this.courses.findAll(query); // { data, meta }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one course' })
  async findOne(@Param() { id }: IdParamDto) {
    return { course: await this.courses.findOne(id) };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a course' })
  async create(@Body() dto: CreateCourseDto, @Res({ passthrough: true }) res: Response) {
    const course = await this.courses.create(dto);
    res.location(`/api/courses/${course.id}`);
    return { course };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a course (full or partial)' })
  async update(@Param() { id }: IdParamDto, @Body() dto: UpdateCourseDto) {
    if (Object.keys(dto).length === 0) throw new BadRequestException('Provide at least one field to update');
    return { course: await this.courses.update(id, dto) };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete a course (is_deleted = 1)' })
  remove(@Param() { id }: IdParamDto) {
    return this.courses.remove(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft-deleted course' })
  async restore(@Param() { id }: IdParamDto) {
    return { course: await this.courses.restore(id) };
  }
}
