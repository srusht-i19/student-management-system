import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from '../auth/jwt.guard';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
@UseGuards(JwtGuard)
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get()
  async findAll(
    @Res({ passthrough: true }) res: Response,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const { students, total } = await this.students.findAll(
      search,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
    res.setHeader('X-Total-Count', String(total));
    return students;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return { student: await this.students.findOne(id) };
  }

  @Post()
  async create(@Body() dto: CreateStudentDto) {
    return { student: await this.students.create(dto) };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStudentDto) {
    return { student: await this.students.update(id, dto) };
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.students.remove(id);
  }
}
