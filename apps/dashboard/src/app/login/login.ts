import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthContextService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthContextService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['roshan@turbovets.com', [Validators.required, Validators.email]],
    password: ['password123', Validators.required],
  });

  errorMessage = '';

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/tasks']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.auth.login(email!, password!).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => (this.errorMessage = 'Invalid email or password'),
      });
    }
  }
}