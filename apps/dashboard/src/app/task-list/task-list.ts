import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, TaskStatus, TaskCategory } from '@turbo-vets/data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, FormsModule],
  templateUrl: './task-list.html',
})
export class TaskListComponent implements OnInit {
  private http = inject(HttpClient);
  
  // Data source of truth
  private allTasks: Task[] = [];
  
  // Kanban Columns
  todo: Task[] = [];
  doing: Task[] = [];
  done: Task[] = [];
  
  // UI State / Filters
  user: any;
  searchTerm: string = '';
  selectedCategory: string = 'All';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  categories = ['All', ...Object.values(TaskCategory)];

  ngOnInit() {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<Task[]>('/api/tasks').subscribe((data) => {
      this.allTasks = data;
      this.applyFilters();
    });
  }

  /**
   * Combined Logic: Category + Search + Sort
   */
  applyFilters() {
    // 1. Filter
    let filtered = this.allTasks.filter(task => {
      const matchesCategory = this.selectedCategory === 'All' || task.category === this.selectedCategory;
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            (task.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);
      return matchesCategory && matchesSearch;
    });

    // 2. Sort
    filtered = filtered.sort((a, b) => {
      const res = a.title.localeCompare(b.title);
      return this.sortOrder === 'asc' ? res : -res;
    });

    // 3. Partition into Status Columns
    this.todo = filtered.filter(t => t.status === TaskStatus.TODO);
    this.doing = filtered.filter(t => t.status === TaskStatus.DOING);
    this.done = filtered.filter(t => t.status === TaskStatus.DONE);
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      
      // Update local object immediately for smooth UI
      task.status = newStatus as TaskStatus;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Delay API call to let CDK animations finish (prevents 'toLowerCase' crash)
      window.requestAnimationFrame(() => {
        this.updateTaskStatus(task.id, task.status);
      });
    }
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    this.http.put(`/api/tasks/${id}`, { status }).subscribe({
      error: () => this.loadTasks() // Revert UI if update fails
    });
  }

  deleteTask(id: string) {
    if (confirm('Are you sure? This action will be logged.')) {
      this.http.delete(`/api/tasks/${id}`).subscribe(() => this.loadTasks());
    }
  }

  trackByTaskId(index: number, task: Task) {
    return task.id;
  }
}