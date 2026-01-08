import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '@turbo-vets/data';
import { AuditService } from './audit.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly auditService: AuditService
  ) {}

  @Get()
  async getAll() {
    // UPDATED: Use the UUID from your Seed Data for the Parent Org
    const tempOrgId = 'd290f1ee-6c54-4b01-90e6-d701748f0851';
    return this.tasksService.findAll(tempOrgId);
  }

  @Post()
  async create(@Body() task: Partial<Task>) {
    // UPDATED: Pass the placeholder User UUID and Org UUID
    const tempUserId = '3f9a7171-460b-4566-9b57-61c1b849547d';
    const taskWithDefaults = {
      ...task,
      creatorId: tempUserId,
      organizationId: task.organizationId || 'd290f1ee-6c54-4b01-90e6-d701748f0851'
    };
    return this.tasksService.create(taskWithDefaults, tempUserId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Task>) {
    // UPDATED: Use the specific User UUID from seed data
    const tempUserId = '3f9a7171-460b-4566-9b57-61c1b849547d';
    return this.tasksService.update(id, data, tempUserId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const tempUserId = '3f9a7171-460b-4566-9b57-61c1b849547d';
    
    // Logic: Log the deletion before it happens
    await this.auditService.log(tempUserId, 'DELETE_TASK', id, 'Task deleted via API');
    
    return this.tasksService.remove(id);
  }

  @Get('audit-log/all') // Renamed slightly to avoid collision with :id route
  async getAuditLogs() {
    return this.auditService.getLogs();
  }
}