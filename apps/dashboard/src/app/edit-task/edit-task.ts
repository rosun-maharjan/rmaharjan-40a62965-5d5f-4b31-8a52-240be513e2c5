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
  private route = inject(ActivatedRoute); // Needed to read :id from URL

  taskId!: string;
  categories = Object.values(TaskCategory);
  statuses = Object.values(TaskStatus);

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    category: [TaskCategory.WORK, Validators.required],
    status: [TaskStatus.TODO, Validators.required]
  });

  ngOnInit() {
    // 1. Pull the ID from the route param /edit-task/:id
    this.taskId = this.route.snapshot.params['id'];
    
    // 2. Load the data to fill the form
    this.http.get<Task>(`/api/tasks/${this.taskId}`).subscribe({
      next: (task) => this.taskForm.patchValue(task),
      error: (err) => console.error('Could not load task', err)
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.http.put(`/api/tasks/${this.taskId}`, this.taskForm.value).subscribe({
        next: () => this.router.navigate(['/tasks']), // Back to list on success
        error: (err) => console.error('Update failed', err)
      });
    }
  }
}