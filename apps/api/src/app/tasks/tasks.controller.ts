import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '@turbo-vets/data';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAll() {
    // For now, hardcode an Org ID to test. We will replace this with Auth data later.
    const tempOrgId = 'org-123'; 
    return this.tasksService.findAll(tempOrgId);
  }

  @Post()
  async create(@Body() task: Partial<Task>) {
    return this.tasksService.create(task);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Task>) {
    return this.tasksService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}