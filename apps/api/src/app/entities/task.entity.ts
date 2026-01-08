import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { UserEntity } from './user.entity';
import { TaskStatus, TaskCategory } from '@turbo-vets/data';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  // Specify the enum type and reference the enum object
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO
  })
  status!: TaskStatus;

  // Specify the enum type and reference the enum object
  @Column({
    type: 'enum',
    enum: TaskCategory,
    default: TaskCategory.WORK
  })
  category!: TaskCategory;

  @Column()
  organizationId!: string;

  @ManyToOne(() => OrganizationEntity)
  organization!: OrganizationEntity;

  @Column()
  creatorId!: string;

  @ManyToOne(() => UserEntity)
  creator!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;
}