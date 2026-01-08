import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskCategory, TaskStatus, Task } from '@turbo-vets/data';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-task.html',
})
export class EditTaskComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskId!: string;
  isLoading = true; // Added for better UX
  categories = Object.values(TaskCategory);
  statuses = Object.values(TaskStatus);

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    category: [TaskCategory.WORK, Validators.required],
    status: [TaskStatus.TODO, Validators.required]
  });

  ngOnInit() {
    this.taskId = this.route.snapshot.params['id'];
    this.loadTask();
  }

  loadTask() {
    this.isLoading = true;
    this.http.get<Task>(`/api/tasks/${this.taskId}`).subscribe({
      next: (task) => {
        // Use patchValue to fill only the fields that match form controls
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          category: task.category,
          status: task.status
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Could not load task', err);
        // If 403 or 404, redirect back to list
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      // The interceptor automatically handles the JWT/Auth header
      this.http.put(`/api/tasks/${this.taskId}`, this.taskForm.value).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => {
          console.error('Update failed', err);
          if (err.status === 403) {
            alert('Permission Denied: Only Admins or Owners can edit tasks.');
          }
        }
      });
    }
  }
}