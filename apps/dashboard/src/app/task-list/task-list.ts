import { Component, OnInit, inject, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, TaskStatus, TaskCategory } from '@turbo-vets/data';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, FormsModule],
  templateUrl: './task-list.html',
})
export class TaskListComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  // Kanban Columns
  todo: Task[] = [];
  doing: Task[] = [];
  done: Task[] = [];
  
  // Total count for progress bar (Fetched from API results)
  totalTasksCount = 0;
  
  // UI State / Filters
  user: any;
  searchTerm: string = '';
  selectedCategory: string = 'All';
  sortOrder: 'asc' | 'desc' = 'asc';
  categories = ['All', ...Object.values(TaskCategory)];

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === '/' && event.target instanceof HTMLBodyElement) {
      event.preventDefault();
      this.searchInput.nativeElement.focus();
    }
    if (event.key === 'n' && event.target instanceof HTMLBodyElement) {
      if (this.user?.role !== 'Viewer') this.router.navigate(['/add-task']);
    }
    if (event.key === 'Escape') {
      this.searchTerm = '';
      this.applyFilters();
      (event.target as HTMLElement).blur();
    }
  }

  ngOnInit() {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;

    // Set up Search Debouncing (Wait 300ms after user stops typing)
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadTasks());

    this.loadTasks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTasks() {
    // Build query parameters for the database
    let params = new HttpParams()
      .set('sort', this.sortOrder.toUpperCase())
      .set('category', this.selectedCategory);

    if (this.searchTerm) {
      params = params.set('search', this.searchTerm);
    }

    this.http.get<Task[]>('/api/tasks', { params }).subscribe((data) => {
      this.totalTasksCount = data.length;
      // Distribute database-filtered results into columns
      this.todo = data.filter(t => t.status === TaskStatus.TODO);
      this.doing = data.filter(t => t.status === TaskStatus.DOING);
      this.done = data.filter(t => t.status === TaskStatus.DONE);
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  applyFilters() {
    this.loadTasks();
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      task.status = newStatus as TaskStatus;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      window.requestAnimationFrame(() => {
        this.http.put(`/api/tasks/${task.id}`, { status: task.status }).subscribe({
          error: () => this.loadTasks()
        });
      });
    }
  }

  deleteTask(id: string) {
    if (confirm('Are you sure? This action will be logged.')) {
      this.http.delete(`/api/tasks/${id}`).subscribe(() => this.loadTasks());
    }
  }

  trackByTaskId(index: number, task: Task) { return task.id; }

  get completionPercentage(): number {
    if (this.totalTasksCount === 0) return 0;
    return Math.round((this.done.length / this.totalTasksCount) * 100);
  }
}