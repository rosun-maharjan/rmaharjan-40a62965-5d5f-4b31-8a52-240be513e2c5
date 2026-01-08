import { Route } from '@angular/router';
import { TaskListComponent } from './task-list/task-list';
import { AddTaskComponent } from './add-task/add-task';
import { AuditLogsComponent } from './audit-logs/audit-logs';
import { EditTaskComponent } from './edit-task/edit-task';
import { LoginComponent } from './login/login';
import { authGuard } from './auth-guard';

export const appRoutes: Route[] = [
    { path: 'login', component: LoginComponent },
    { path: 'tasks', component: TaskListComponent, canActivate: [authGuard] },
    { path: 'add-task', component: AddTaskComponent, canActivate: [authGuard] },
    { path: 'audit-logs', component: AuditLogsComponent, canActivate: [authGuard] },
    { path: 'edit-task/:id', component: EditTaskComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];