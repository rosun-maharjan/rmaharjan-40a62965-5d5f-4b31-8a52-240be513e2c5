import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { OrganizationEntity } from './organization.entity.js';
import { UserEntity } from './user.entity.js';
import { TaskStatus, TaskCategory } from '../data.js';

@Entity('tasks')
/** * COMPOSITE INDEX: 
 * Highly efficient for the findAll() query: 
 * WHERE organizationId = ? ORDER BY title ASC
 */
@Index(['organizationId', 'title'])
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO
  })
  status!: TaskStatus;

  /**
   * INDIVIDUAL INDEX:
   * Speeds up filtering by specific categories like "Work" or "Personal"
   */
  @Index()
  @Column({
    type: 'enum',
    enum: TaskCategory,
    default: TaskCategory.WORK
  })
  category!: TaskCategory;

  /**
   * FOREIGN KEY INDEX:
   * Crucial for multi-tenancy performance to quickly isolate data
   */
  @Index()
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