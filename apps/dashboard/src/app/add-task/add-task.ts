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

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    category: [TaskCategory.WORK, Validators.required],
    status: [TaskStatus.TODO],
    organizationId: ['org-123'], // Placeholder until Auth is integrated
    creatorId: ['user-123']      // Placeholder until Auth is integrated
  });

  onSubmit() {
    if (this.taskForm.valid) {
      this.http.post('/api/tasks', this.taskForm.value).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }
}