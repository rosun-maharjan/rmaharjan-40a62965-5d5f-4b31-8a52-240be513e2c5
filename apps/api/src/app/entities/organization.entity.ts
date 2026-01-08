import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('organizations')
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  // Self-reference for the hierarchy (Level 1: Parent, Level 2: Sub-org)
  @Column({ nullable: true })
  parentId?: string;

  @ManyToOne(() => OrganizationEntity, (org) => org.children)
  parent?: OrganizationEntity;

  @OneToMany(() => OrganizationEntity, (org) => org.parent)
  children?: OrganizationEntity[];
}