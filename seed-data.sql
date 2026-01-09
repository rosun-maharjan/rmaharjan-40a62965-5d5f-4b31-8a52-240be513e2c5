-- ==========================================================
-- 1. SEED ORGANIZATIONS
-- ==========================================================
INSERT INTO organizations (id, name, "parentId") VALUES 
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'TurboVets HQ', NULL),
('74889c62-106e-4620-94e8-8a8f158309a6', 'Field Operations', 'd290f1ee-6c54-4b01-90e6-d701748f0851');

-- ==========================================================
-- 2. SEED USERS 
-- Roles use: 'Owner', 'Admin', 'Viewer'
-- ==========================================================
INSERT INTO users (id, email, password, role, "organizationId") VALUES 
('3f9a7171-460b-4566-9b57-61c1b849547d', 'owner@turbovets.com', '$2b$10$GGFI38ljyvhwLarWOt9zf.PA4njaaa8nHTKCecr9SQxXPTvWVgSUa', 'Owner', 'd290f1ee-6c54-4b01-90e6-d701748f0851'),
('a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', 'admin@turbovets.com', '$2b$10$GGFI38ljyvhwLarWOt9zf.PA4njaaa8nHTKCecr9SQxXPTvWVgSUa', 'Admin', 'd290f1ee-6c54-4b01-90e6-d701748f0851'),
('f9e8d7c6-b5a4-4c3d-2e1f-0a9b8c7d6e5f', 'viewer@turbovets.com', '$2b$10$GGFI38ljyvhwLarWOt9zf.PA4njaaa8nHTKCecr9SQxXPTvWVgSUa', 'Viewer', 'd290f1ee-6c54-4b01-90e6-d701748f0851'),
('b1c2d3e4-f5a6-4b5c-9d8e-7f6a5b4c3d2e', 'field-owner@turbovets.com', '$2b$10$GGFI38ljyvhwLarWOt9zf.PA4njaaa8nHTKCecr9SQxXPTvWVgSUa', 'Owner', '74889c62-106e-4620-94e8-8a8f158309a6');

-- ==========================================================
-- 3. SEED TASKS
-- Status: 'Todo', 'Doing', 'Done' | Category: 'Work', 'Personal'
-- ==========================================================
INSERT INTO tasks (id, title, description, category, status, "organizationId", "creatorId") VALUES 
(
  'e2e89647-8f55-4670-8b1d-727521783301', 
  'Quarterly Financial Review', 
  'Analyze Q4 budget vs actuals for HQ.', 
  'Work', 
  'Todo', 
  'd290f1ee-6c54-4b01-90e6-d701748f0851', 
  '3f9a7171-460b-4566-9b57-61c1b849547d'
),
(
  'f5a89647-8f55-4670-8b1d-727521783302', 
  'Staff Training - Ethics', 
  'Mandatory compliance training for all HQ staff.', 
  'Work', 
  'Doing', 
  'd290f1ee-6c54-4b01-90e6-d701748f0851', 
  'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d'
),
(
  'c3b89647-8f55-4670-8b1d-727521783303', 
  'Mobile Unit Inspection', 
  'Annual safety check for the Field Ops van.', 
  'Work', 
  'Todo', 
  '74889c62-106e-4620-94e8-8a8f158309a6', 
  'b1c2d3e4-f5a6-4b5c-9d8e-7f6a5b4c3d2e'
);
