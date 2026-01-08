import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Vet } from '@turbo-vets/data'; // Our shared interface

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private http = inject(HttpClient);
  vets: Vet[] = [];

  ngOnInit() {
    // Note: The /api prefix works because of the proxy.conf.json we set up
    this.http.get<Vet[]>('/api/vets').subscribe({
      next: (data) => (this.vets = data),
      error: (err) => console.error('Could not fetch vets:', err)
    });
  }
}