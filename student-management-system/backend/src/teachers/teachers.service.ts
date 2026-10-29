import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListViewBuilder, ListViewConfig } from '../common/list-view/list-view.builder';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { ListTeachersQueryDto } from './dto/list-teachers-query.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

const TEACHER_LIST: ListViewConfig = {
  searchFields: ["CONCAT(t.first_name, ' ', t.last_name)", 't.email', 't.department', 't.designation'],
  sortableFields: ['first_name', 'last_name', 'email', 'department', 'designation', 'status', 'created_at'],
  defaultSort: { field: 'created_at', order: 'DESC' },
  filterableFields: ['status', 'department'],
  paginateByDefault: true,
};

@Injectable()
export class TeachersService {
  constructor(@InjectRepository(Teacher) private readonly repo: Repository<Teacher>) {}

  findAll(query: ListTeachersQueryDto) {
    const qb = this.repo.createQueryBuilder('t').where('t.is_deleted = :deleted', { deleted: false });
    return ListViewBuilder.from(qb, TEACHER_LIST).fromQuery(query).build();
  }

  async findOne(id: number) {
    const teacher = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!teacher) throw new NotFoundException(`Teacher with id ${id} not found`);
    return teacher;
  }

  async create(dto: CreateTeacherDto) {
    await this.assertEmailFree(dto.email);
    const saved = await this.repo.save(this.repo.create({ ...dto, phone: dto.phone ?? null }));
    return this.findOne(saved.id); // re-read so hidden columns (is_deleted...) are not returned
  }

  async update(id: number, dto: UpdateTeacherDto) {
    const teacher = await this.findOne(id);
    if (dto.email && dto.email !== teacher.email) await this.assertEmailFree(dto.email);
    Object.assign(teacher, dto);
    await this.repo.save(teacher);
    return this.findOne(id); // re-read so hidden columns are not returned
  }

  /** Soft delete in one atomic UPDATE. */
  async remove(id: number) {
    const result = await this.repo.update(
      { id, is_deleted: false },
      { is_deleted: true, deleted_at: new Date() },
    );
    if (!result.affected) throw new NotFoundException(`Teacher with id ${id} not found`);
    return { message: 'Teacher deleted successfully' };
  }

  async restore(id: number) {
    const result = await this.repo.update({ id, is_deleted: true }, { is_deleted: false, deleted_at: null });
    if (!result.affected) throw new NotFoundException(`Deleted teacher with id ${id} not found`);
    return this.findOne(id);
  }

  private async assertEmailFree(email: string) {
    const existing = await this.repo.findOne({ where: { email }, select: { id: true, is_deleted: true } });
    if (!existing) return;
    throw new ConflictException(
      existing.is_deleted
        ? `A deleted teacher (id ${existing.id}) already uses this email. Restore that record instead.`
        : 'A teacher with this email already exists',
    );
  }
}
