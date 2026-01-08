import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Task, TaskStatus, TaskCategory } from '@turbo-vets/data';

@Entity('tasks')
export class TaskEntity implements Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status!: TaskStatus;

  @Column({ type: 'enum', enum: TaskCategory, default: TaskCategory.WORK })
  category!: TaskCategory;

  @Column()
  organizationId!: string;

  @Column()
  creatorId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}