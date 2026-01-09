import { Inject, Injectable, NotFoundException, ForbiddenException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskEntity } from '@turbo-vets/data';
import { AuditService } from './audit.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
    @Inject(forwardRef(() => AuditService))
    private auditService: AuditService
  ) {}

  /**
   * Scoped to Organization: Only returns tasks belonging to the user's org.
   */
  async findAll(
      orgId: string, 
      filters: { search?: string, category?: string, sort?: 'ASC' | 'DESC' }
    ): Promise<Task[]> {
      const { search, category, sort } = filters;

      // Start building the query scoped to the organization
      const query = this.taskRepo.createQueryBuilder('task')
        .where('task.organizationId = :orgId', { orgId });

      // 1. Category Filter (Ignore if 'All')
      if (category && category !== 'All') {
        query.andWhere('task.category = :category', { category });
      }

      // 2. Search Filter (Title OR Description)
      if (search) {
        // We use ILike for PostgreSQL (case-insensitive) 
        // Use %search% to match anywhere in the string
        query.andWhere(
          '(task.title ILike :searchTerm OR task.description ILike :searchTerm)',
          { searchTerm: `%${search}%` }
        );
      }

      // 3. Sorting (Requirement: Alphabetical by Title)
      query.orderBy('task.title', sort || 'ASC');

      return query.getMany();
    }

  /**
   * Includes orgId and creatorId to maintain data integrity.
   */
  async create(taskData: Partial<Task>, userId: string, orgId: string): Promise<Task> {
    const task = this.taskRepo.create({
      ...taskData,
      creatorId: userId,
      organizationId: orgId
    });
    
    const savedTask = await this.taskRepo.save(task);

    await this.auditService.log(
      userId,
      'CREATE_TASK',
      savedTask.id,
      `Task created: ${savedTask.title}`
    );

    return savedTask;
  }

  /**
   * CRITICAL: Always check orgId when fetching a single record.
   */
  async findOne(id: string, orgId: string): Promise<TaskEntity> {
    const task = await this.taskRepo.findOne({ 
      where: { 
        id, 
        organization: { id: orgId } 
      } 
    });

    if (!task) {
      // We throw NotFound or Forbidden to avoid leaking information about IDs that exist in other orgs
      throw new NotFoundException(`Task not found within your organization`);
    }
    return task;
  }

  /**
   * Updates task only if it belongs to the user's organization.
   */
  async update(id: string, updateData: Partial<Task>, userId: string, orgId: string): Promise<Task> {
    // This call ensures the task exists and belongs to the user's org
    const task = await this.findOne(id, orgId); 

    await this.taskRepo.update(id, updateData);

    await this.auditService.log(
      userId,
      'UPDATE_TASK',
      id,
      `Updated fields: ${Object.keys(updateData).join(', ')}`
    );

    return this.findOne(id, orgId);
  }

  /**
   * Removes task after verifying organization ownership.
   */
  async remove(id: string, orgId: string): Promise<void> {
    const task = await this.findOne(id, orgId); 
    await this.taskRepo.delete(task.id);
    
    // The controller is currently logging deletes, 
    // but having the org-check here is the ultimate safety net.
  }
}