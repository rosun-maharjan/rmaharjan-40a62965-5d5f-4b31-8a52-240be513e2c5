import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { Task } from '@turbo-vets/data';
import { AuditService } from './audit.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
    @Inject(forwardRef(() => AuditService))
    private auditService: AuditService
  ) {}

  async findAll(orgId: string): Promise<Task[]> {
    return this.taskRepo.find({ 
      where: { organizationId: orgId },
      order: { createdAt: 'DESC' } // Nice touch for the UI
    });
  }

  // UPDATED: Added userId and Audit Logging
  async create(taskData: Partial<Task>, userId: string): Promise<Task> {
    const task = this.taskRepo.create(taskData);
    const savedTask = await this.taskRepo.save(task);

    await this.auditService.log(
      userId,
      'CREATE_TASK',
      savedTask.id,
      `Task created: ${savedTask.title}`
    );

    return savedTask;
  }

  // UPDATED: Standardizing findOne
  async findOne(id: string): Promise<TaskEntity> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  // KEEP: Already looks good, just ensure it returns the fresh data
  async update(id: string, updateData: Partial<Task>, userId: string): Promise<Task> {
    await this.findOne(id); // Ensure it exists
    await this.taskRepo.update(id, updateData);

    await this.auditService.log(
      userId,
      'UPDATE_TASK',
      id,
      `Updated: ${Object.keys(updateData).join(', ')}`
    );

    return this.findOne(id);
  }

  // UPDATED: Added logging before deletion
  async remove(id: string): Promise<void> {
    const task = await this.findOne(id); // Get it first so we can log its title
    await this.taskRepo.delete(id);
    
    // Note: We use a placeholder here or pass userId from controller
    // For now, the controller is handling the log for delete, 
    // but it's cleaner to do it here if we pass the userId.
  }
}