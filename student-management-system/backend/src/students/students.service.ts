import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ListStudentsQueryDto } from './dto/list-students-query.dto';
import { ListViewBuilder, ListViewConfig } from '../common/list-view/list-view.builder';

const STUDENT_LIST: ListViewConfig = {
  searchFields: ["CONCAT(s.first_name, ' ', s.last_name)", 's.email', 's.course'],
  sortableFields: ['first_name', 'last_name', 'email', 'course', 'year', 'status', 'created_at'],
  defaultSort: { field: 'created_at', order: 'DESC' },
  filterableFields: ['status', 'gender', 'course', 'year'],
  paginateByDefault: false, // the current dashboard loads everything and pages in the browser
};

@Injectable()
export class StudentsService {
  constructor(@InjectRepository(Student) private readonly repo: Repository<Student>) {}

  /** Lists active (not deleted) students using the common List View Builder. */
  findAll(query: ListStudentsQueryDto) {
    const qb = this.repo.createQueryBuilder('s').where('s.is_deleted = :deleted', { deleted: false });
    return ListViewBuilder.from(qb, STUDENT_LIST).fromQuery(query).build();
  }

  /** A soft-deleted student is treated exactly like one that does not exist. */
  async findOne(id: number) {
    const student = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!student) throw new NotFoundException(`Student with id ${id} not found`);
    return student;
  }

  async create(dto: CreateStudentDto) {
    await this.assertEmailFree(dto.email);
    const saved = await this.repo.save(this.repo.create({ ...dto, phone: dto.phone ?? null }));
    return this.findOne(saved.id); // re-read so hidden columns (is_deleted...) are not returned
  }

  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.findOne(id);
    if (dto.email && dto.email !== student.email) await this.assertEmailFree(dto.email);
    Object.assign(student, dto);
    await this.repo.save(student);
    return this.findOne(id); // re-read so hidden columns are not returned
  }

  /**
   * Soft delete: the row stays in the database with is_deleted = 1 and a deleted_at time.
   * One atomic UPDATE (no read-then-write), so two parallel deletes cannot both succeed.
   */
  async remove(id: number) {
    const result = await this.repo.update(
      { id, is_deleted: false },
      { is_deleted: true, deleted_at: new Date() },
    );
    if (!result.affected) throw new NotFoundException(`Student with id ${id} not found`);
    return { message: 'Student deleted successfully' };
  }

  /** Undo a soft delete. */
  async restore(id: number) {
    const result = await this.repo.update(
      { id, is_deleted: true },
      { is_deleted: false, deleted_at: null },
    );
    if (!result.affected) throw new NotFoundException(`Deleted student with id ${id} not found`);
    return this.findOne(id);
  }

  /**
   * Email is UNIQUE in the table, and soft-deleted rows still hold their email,
   * so the check must include deleted rows and explain the situation clearly.
   */
  private async assertEmailFree(email: string) {
    const existing = await this.repo.findOne({
      where: { email },
      select: { id: true, is_deleted: true },
    });
    if (!existing) return;
    throw new ConflictException(
      existing.is_deleted
        ? `A deleted student (id ${existing.id}) already uses this email. Restore that record instead.`
        : 'A student with this email already exists',
    );
  }
}
