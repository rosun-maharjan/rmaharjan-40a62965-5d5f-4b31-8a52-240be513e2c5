import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '@turbo-vets/data';
import { AuditService } from './audit.service';
import { AuthGuard } from '@nestjs/passport';
// 1. Import your new RBAC tools
import { RbacGuard, Roles, Role } from '@turbo-vets/auth';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: Role; // Use the Enum here for better type checking
    orgId: string;
  };
}

@Controller('tasks')
@UseGuards(AuthGuard('jwt'), RbacGuard) // 2. Add RbacGuard globally for this controller
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly auditService: AuditService
  ) {}

  @Get()
  @Roles(Role.Viewer)
  async getAll(
    @Request() req: AuthenticatedRequest,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('sort') sort: 'ASC' | 'DESC' = 'DESC'
  ) {
    return this.tasksService.findAll(req.user.orgId, { search, category, sort });
  }

  @Post()
  @Roles(Role.Admin) // 4. Only Admin and Owner can create
  async create(@Request() req: AuthenticatedRequest, @Body() task: Partial<Task>) {
    const taskWithDefaults = {
      ...task,
      creatorId: req.user.userId,
      organizationId: req.user.orgId
    };
    return this.tasksService.create(taskWithDefaults, req.user.userId, req.user.orgId);
  }

  @Get(':id')
  @Roles(Role.Viewer)
  async getOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    // 5. Enforce Org-level access by passing orgId to the service
    return this.tasksService.findOne(id, req.user.orgId);
  }

  @Put(':id')
  @Roles(Role.Admin) // 6. Admin and Owner can edit
  async update(@Request() req: AuthenticatedRequest, @Param('id') id: string, @Body() data: Partial<Task>) {
    return this.tasksService.update(id, data, req.user.userId, req.user.orgId);
  }

  @Delete(':id')
  @Roles(Role.Owner) // 7. Only Owner can delete
  async remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.auditService.log(req.user.userId, 'DELETE_TASK', id, 'Task deleted via API');
    return this.tasksService.remove(id, req.user.orgId);
  }

  @Get('audit-log/all')
  @Roles(Role.Admin) // 8. Only Admin and Owner can see audit logs
  async getAuditLogs(@Request() req: AuthenticatedRequest) {
    return this.auditService.getLogsByOrg(req.user.orgId);
  }
}