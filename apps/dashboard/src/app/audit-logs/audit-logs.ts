import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuditLog } from '@turbo-vets/data';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-logs.html',
})
export class AuditLogsComponent implements OnInit {
  private http = inject(HttpClient);
  
  // We initialize with an empty array
  logs: AuditLog[] = [];
  isLoading = true;

  ngOnInit() {
    this.fetchLogs();
  }

  fetchLogs() {
    this.isLoading = true;
    // Note: We will implement this endpoint in the NestJS API next
    this.http.get<AuditLog[]>('/api/tasks/audit-log/all').subscribe({
      next: (data) => {
        this.logs = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load audit logs:', err);
        this.isLoading = false;
      }
    });
  }
}