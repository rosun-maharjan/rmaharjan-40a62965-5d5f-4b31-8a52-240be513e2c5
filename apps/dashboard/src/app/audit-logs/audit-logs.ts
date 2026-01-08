import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// We extend the AuditLog type locally to include the user relation we added in NestJS
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
    // Points to the endpoint we secured with @Roles(Role.Admin)
    this.http.get<AuditLogWithUser[]>('/api/tasks/audit-log/all').subscribe({
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