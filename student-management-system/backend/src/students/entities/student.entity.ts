import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum StudentStatus {
  Active = "Active",
  Inactive = "Inactive",
}

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  first_name!: string;

  @Column({ type: "varchar", length: 50 })
  last_name!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 15, nullable: true })
  phone!: string | null;

  @Column({ type: "date" })
  date_of_birth!: string;

  @Column({ type: "enum", enum: Gender })
  gender!: Gender;

  @Column({ type: "varchar", length: 50 })
  course!: string;

  @Column({ type: "int" })
  year!: number;

  @Column({ type: "enum", enum: StudentStatus, default: StudentStatus.Active })
  status!: StudentStatus;

  /** Soft-delete flag. 1 = deleted. Hidden from API responses (select: false). */
  @Index()
  @Column({ type: "boolean", default: false, select: false })
  is_deleted!: boolean;

  /** When the record was soft-deleted (audit trail). Hidden from API responses. */
  @Column({ type: "datetime", nullable: true, default: null, select: false })
  deleted_at!: Date | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}
