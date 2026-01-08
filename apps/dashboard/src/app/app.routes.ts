import { Route } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.js';
import { AddTaskComponent } from './add-task/add-task.js';

export const appRoutes: Route[] = [
  { path: 'tasks', component: TaskListComponent },
  { path: 'add-task', component: AddTaskComponent },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' }
];