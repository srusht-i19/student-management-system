import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListViewBuilder, ListViewConfig } from '../common/list-view/list-view.builder';
import { CreateCourseDto } from './dto/create-course.dto';
import { ListCoursesQueryDto } from './dto/list-courses-query.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

const COURSE_LIST: ListViewConfig = {
  searchFields: ['c.code', 'c.name', 'c.description'],
  sortableFields: ['code', 'name', 'duration_years', 'status', 'created_at'],
  defaultSort: { field: 'created_at', order: 'DESC' },
  filterableFields: ['status', 'duration_years'],
  paginateByDefault: true,
};

@Injectable()
export class CoursesService {
  constructor(@InjectRepository(Course) private readonly repo: Repository<Course>) {}

  findAll(query: ListCoursesQueryDto) {
    const qb = this.repo.createQueryBuilder('c').where('c.is_deleted = :deleted', { deleted: false });
    return ListViewBuilder.from(qb, COURSE_LIST).fromQuery(query).build();
  }

  async findOne(id: number) {
    const course = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!course) throw new NotFoundException(`Course with id ${id} not found`);
    return course;
  }

  async create(dto: CreateCourseDto) {
    await this.assertCodeFree(dto.code);
    const saved = await this.repo.save(this.repo.create({ ...dto, description: dto.description ?? null }));
    return this.findOne(saved.id); // re-read so hidden columns (is_deleted...) are not returned
  }

  async update(id: number, dto: UpdateCourseDto) {
    const course = await this.findOne(id);
    if (dto.code && dto.code !== course.code) await this.assertCodeFree(dto.code);
    Object.assign(course, dto);
    await this.repo.save(course);
    return this.findOne(id); // re-read so hidden columns are not returned
  }

  /** Soft delete in one atomic UPDATE. */
  async remove(id: number) {
    const result = await this.repo.update(
      { id, is_deleted: false },
      { is_deleted: true, deleted_at: new Date() },
    );
    if (!result.affected) throw new NotFoundException(`Course with id ${id} not found`);
    return { message: 'Course deleted successfully' };
  }

  async restore(id: number) {
    const result = await this.repo.update({ id, is_deleted: true }, { is_deleted: false, deleted_at: null });
    if (!result.affected) throw new NotFoundException(`Deleted course with id ${id} not found`);
    return this.findOne(id);
  }

  /** The code is UNIQUE and soft-deleted rows keep theirs, so deleted rows are checked too. */
  private async assertCodeFree(code: string) {
    const existing = await this.repo.findOne({ where: { code }, select: { id: true, is_deleted: true } });
    if (!existing) return;
    throw new ConflictException(
      existing.is_deleted
        ? `A deleted course (id ${existing.id}) already uses this code. Restore that record instead.`
        : 'A course with this code already exists',
    );
  }
}
