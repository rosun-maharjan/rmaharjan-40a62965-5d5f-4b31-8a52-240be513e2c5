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