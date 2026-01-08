import { Route } from '@angular/router';
import { TaskListComponent } from './task-list/task-list';
import { AddTaskComponent } from './add-task/add-task';
import { AuditLogsComponent } from './audit-logs/audit-logs';
import { EditTaskComponent } from './edit-task/edit-task';

export const appRoutes: Route[] = [
  { path: 'tasks', component: TaskListComponent },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'audit-logs', component: AuditLogsComponent },
  { path: 'edit-task/:id', component: EditTaskComponent },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' }
];