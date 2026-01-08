import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { AuditLog } from '@turbo-vets/data';

@Entity('audit_logs')
export class AuditLogEntity implements AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  action!: string;

  @Column()
  resource!: string;

  @Column({ type: 'text', nullable: true })
  details!: string;

  @CreateDateColumn()
  timestamp!: Date;
}