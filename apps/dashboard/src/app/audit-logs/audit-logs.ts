import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface AuditLogWithUser {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  user: {
    email: string;
    role: string;
  };
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-logs.html',
})
export class AuditLogsComponent implements OnInit {
  private http = inject(HttpClient);
  
  logs: AuditLogWithUser[] = [];
  isLoading = true;

  ngOnInit() {
    this.fetchLogs();
  }

  fetchLogs() {
    this.isLoading = true;
    this.http.get<AuditLogWithUser[]>('/api/tasks/audit-log/all').subscribe({
      next: (data) => {
        // Sort logs so that newest entries appear at the top
        this.logs = data.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load audit logs:', err);
        this.isLoading = false;
        // Optional: Add a redirect if 403 (unauthorized) occurs
      }
    });
  }
}