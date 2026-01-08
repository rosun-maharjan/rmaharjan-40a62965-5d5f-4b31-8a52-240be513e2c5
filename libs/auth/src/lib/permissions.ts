export enum Role {
  Owner = 'Owner',
  Admin = 'Admin',
  Viewer = 'Viewer',
}

// Higher number = More power
export const RoleHierarchy: Record<Role, number> = {
  [Role.Viewer]: 1,
  [Role.Admin]: 2,
  [Role.Owner]: 3,
};

export const Permissions = {
  TASK_READ: [Role.Viewer, Role.Admin, Role.Owner],
  TASK_WRITE: [Role.Admin, Role.Owner],
  TASK_DELETE: [Role.Owner],
  AUDIT_READ: [Role.Admin, Role.Owner],
};