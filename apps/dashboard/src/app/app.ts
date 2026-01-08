import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  ngOnInit() {
  }

  private router = inject(Router);
  
  // Get user data from storage to display in the UI
  get user() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  logout() {
    // 1. Clear the token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 2. Redirect back to the login page
    this.router.navigate(['/login']);
  }
}