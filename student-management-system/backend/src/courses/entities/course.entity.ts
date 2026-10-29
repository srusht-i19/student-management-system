import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/app-base.entity';

export enum CourseStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

@Entity('courses')
export class Course extends AppBaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int' })
  duration_years: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.Active })
  status: CourseStatus;
}
