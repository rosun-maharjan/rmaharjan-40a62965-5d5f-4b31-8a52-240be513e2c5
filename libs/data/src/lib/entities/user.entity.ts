import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserRole } from '@turbo-vets/data';
import { OrganizationEntity } from './organization.entity.js';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) // Password won't be sent in JSON by default
  password!: string;

  @Column({ type: 'varchar' }) // Store 'Owner', 'Admin', or 'Viewer'
  role!: UserRole;

  @Column()
  organizationId!: string;

  @ManyToOne(() => OrganizationEntity)
  organization!: OrganizationEntity;
}