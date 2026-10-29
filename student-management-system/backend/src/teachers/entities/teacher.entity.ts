import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/app-base.entity';

export enum TeacherStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

@Entity('teachers')
export class Teacher extends AppBaseEntity {
  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 100 })
  department: string;

  @Column({ type: 'varchar', length: 100 })
  designation: string;

  @Column({ type: 'enum', enum: TeacherStatus, default: TeacherStatus.Active })
  status: TeacherStatus;
}
