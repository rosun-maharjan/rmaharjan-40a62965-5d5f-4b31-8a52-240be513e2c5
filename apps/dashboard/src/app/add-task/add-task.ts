import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { TaskCategory, TaskStatus } from '@turbo-vets/data';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-task.html',
})
export class AddTaskComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  categories = Object.values(TaskCategory);

  // REMOVED: organizationId and creatorId placeholders. 
  // The backend handles these via the JWT token now.
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    category: [TaskCategory.WORK, Validators.required],
    status: [TaskStatus.TODO, Validators.required],
  });

  onSubmit() {
    if (this.taskForm.valid) {
      // The interceptor will automatically add 'Authorization: Bearer <token>'
      this.http.post('/api/tasks', this.taskForm.value).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          console.error('Task creation failed:', err);
          alert('Failed to create task. You may not have permission.');
        }
      });
    }
  }
}