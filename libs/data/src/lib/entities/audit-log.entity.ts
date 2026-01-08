import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AuditLog } from '@turbo-vets/data';
import { UserEntity } from './user.entity.js'; // Ensure this path is correct

@Entity('audit_logs')
export class AuditLogEntity implements AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  /**
   * Relation to the User who performed the action.
   * This allows us to access the user's organizationId during queries.
   */
  @ManyToOne(() => UserEntity, (user : UserEntity) => user.id)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column()
  action!: string;

  @Column()
  resource!: string;

  @Column({ type: 'text', nullable: true })
  details!: string;

  @CreateDateColumn()
  timestamp!: Date;
}