import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Task, TaskStatus } from '@turbo-vets/data';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.html',
})
export class TaskListComponent implements OnInit {
  private http = inject(HttpClient);
  tasks: Task[] = [];

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<Task[]>('/api/tasks').subscribe((data) => (this.tasks = data));
  }

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.DONE: return 'bg-green-100 text-green-800';
      case TaskStatus.DOING: return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }

  deleteTask(id: string) {
    if (confirm('Are you sure?')) {
      this.http.delete(`/api/tasks/${id}`).subscribe(() => this.loadTasks());
    }
  }
}