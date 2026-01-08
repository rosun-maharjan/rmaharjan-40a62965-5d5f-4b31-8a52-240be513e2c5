import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { Task } from '@turbo-vets/data';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>
  ) {}

  async findAll(orgId: string): Promise<Task[]> {
    // Eventually, the Guard will pass the orgId here
    return this.taskRepo.find({ where: { organizationId: orgId } });
  }

  async create(taskData: Partial<Task>): Promise<Task> {
    const task = this.taskRepo.create(taskData);
    return this.taskRepo.save(task);
  }

  async update(id: string, updateData: Partial<Task>): Promise<Task> {
    await this.taskRepo.update(id, updateData);
    const updated = await this.taskRepo.findOne({ where: { id } });
    if (!updated) throw new NotFoundException();
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.taskRepo.delete(id);
  }
}