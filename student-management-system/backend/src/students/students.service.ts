import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "./entities/student.entity";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private readonly repo: Repository<Student>,
  ) {}

  /** Lists students. Pagination is optional: pass `page` to get a single page. */
  async findAll(search?: string, page?: number, limit = 10) {
    const qb = this.repo
      .createQueryBuilder("s")
      .orderBy("s.created_at", "DESC");

    if (search?.trim()) {
      qb.where(
        `CONCAT(s.first_name, ' ', s.last_name) LIKE :q
         OR s.email LIKE :q OR s.course LIKE :q`,
        { q: `%${search.trim()}%` },
      );
    }

    const total = await qb.getCount();
    if (page && page > 0) qb.skip((page - 1) * limit).take(limit);

    return { students: await qb.getMany(), total };
  }

  async findOne(id: number) {
    const student = await this.repo.findOne({ where: { id } });
    if (!student)
      throw new NotFoundException(`Student with id ${id} not found`);
    return student;
  }

  async create(dto: CreateStudentDto) {
    await this.assertEmailFree(dto.email);
    const student = this.repo.create({ ...dto, phone: dto.phone ?? null });
    return this.repo.save(student);
  }

  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.findOne(id);
    if (dto.email && dto.email !== student.email)
      await this.assertEmailFree(dto.email);
    Object.assign(student, dto);
    return this.repo.save(student);
  }

  async remove(id: number) {
    const result = await this.repo.update(
      { id, is_deleted: false },
      { is_deleted: true, deleted_at: new Date() },
    );
    if (!result.affected)
      throw new NotFoundException(`Student with id ${id} not found`);
    return { message: "Student deleted successfully" };
  }

  private async assertEmailFree(email: string) {
    if (await this.repo.exist({ where: { email } })) {
      throw new ConflictException("A student with this email already exists");
    }
  }
}
