import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User, UserRole } from '@turbo-vets/data';
import { OrganizationEntity } from './organization.entity';

@Entity()
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) // Security: Don't return password in queries
  password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
  role!: UserRole;

  @Column()
  organizationId!: string;

  @ManyToOne(() => OrganizationEntity)
  organization!: OrganizationEntity;
}