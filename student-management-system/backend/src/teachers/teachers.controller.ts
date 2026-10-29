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
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { ListTeachersQueryDto } from './dto/list-teachers-query.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersService } from './teachers.service';

@ApiTags('Teachers')
@ApiBearerAuth()
@ApiStandardErrors()
@Controller('teachers')
@UseGuards(JwtGuard)
export class TeachersController {
  constructor(private readonly teachers: TeachersService) {}

  @Get()
  @ApiOperation({ summary: 'List teachers (search, filter, sort, paginate)' })
  findAll(@Query() query: ListTeachersQueryDto) {
    return this.teachers.findAll(query); // { data, meta }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one teacher' })
  async findOne(@Param() { id }: IdParamDto) {
    return { teacher: await this.teachers.findOne(id) };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a teacher' })
  async create(@Body() dto: CreateTeacherDto, @Res({ passthrough: true }) res: Response) {
    const teacher = await this.teachers.create(dto);
    res.location(`/api/teachers/${teacher.id}`);
    return { teacher };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a teacher (full or partial)' })
  async update(@Param() { id }: IdParamDto, @Body() dto: UpdateTeacherDto) {
    if (Object.keys(dto).length === 0) throw new BadRequestException('Provide at least one field to update');
    return { teacher: await this.teachers.update(id, dto) };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete a teacher (is_deleted = 1)' })
  remove(@Param() { id }: IdParamDto) {
    return this.teachers.remove(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore a soft-deleted teacher' })
  async restore(@Param() { id }: IdParamDto) {
    return { teacher: await this.teachers.restore(id) };
  }
}
