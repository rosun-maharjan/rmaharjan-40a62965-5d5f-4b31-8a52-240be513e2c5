export enum UserRole {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  VIEWER = 'Viewer'
}

export enum TaskStatus {
  TODO = 'Todo',
  DOING = 'Doing',
  DONE = 'Done'
}

export enum TaskCategory {
  WORK = 'Work',
  PERSONAL = 'Personal'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  parentId?: string; // For 2-level hierarchy
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  organizationId: string;
  creatorId: string;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;      // e.g., 'CREATE_TASK', 'UPDATE_TASK', 'DELETE_TASK'
  resource: string;    // e.g., 'task-uuid-123'
  details: string;     // e.g., 'Changed status to Done'
  timestamp: Date;
}