import { Column, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/** Columns every new module shares: id, timestamps and the soft-delete flag. */
export abstract class AppBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /** 1 = soft-deleted. Hidden from API responses. */
  @Index()
  @Column({ type: 'boolean', default: false, select: false })
  is_deleted: boolean;

  @Column({ type: 'datetime', nullable: true, default: null, select: false })
  deleted_at: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
