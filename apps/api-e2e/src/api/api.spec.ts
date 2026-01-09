import axios from 'axios';

describe('Tasks API & Security E2E', () => {
  const API_URL = 'http://localhost:3000/api';
  
  let ownerToken: string;
  let adminToken: string;
  let viewerToken: string;

  beforeAll(async () => {
    // Helper to authenticate different roles
    const login = (email: string) => 
      axios.post(`${API_URL}/auth/login`, { email, password: 'password' });
    
    const [ownerRes, adminRes, viewerRes] = await Promise.all([
      login('owner@test.com'),
      login('admin@test.com'),
      login('viewer@test.com')
    ]);

    ownerToken = ownerRes.data.access_token;
    adminToken = adminRes.data.access_token;
    viewerToken = viewerRes.data.access_token;
  });

  // --- SECTION 1: ROLE-BASED ACCESS CONTROL (RBAC) ---

  it('[RBAC] should prevent a Viewer from deleting a task (403 Forbidden)', async () => {
    const request = axios.delete(`${API_URL}/tasks/any-id`, {
      headers: { Authorization: `Bearer ${viewerToken}` }
    });

    await expect(request).rejects.toMatchObject({
      response: { status: 403 }
    });
  });

  it('[RBAC] should prevent an Admin from deleting a task (Owner-only privilege)', async () => {
    const request = axios.delete(`${API_URL}/tasks/any-id`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    await expect(request).rejects.toMatchObject({
      response: { status: 403 }
    });
  });

  it('[RBAC] should allow an Admin to Update a task (Role Inheritance)', async () => {
    // Note: ID should exist in your test seed data
    const taskId = 'valid-task-id'; 
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, 
      { title: 'Updated Title' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    expect(response.status).toBe(200);
    expect(response.data.title).toBe('Updated Title');
  });

  // --- SECTION 2: MULTI-TENANCY ISOLATION ---

  it('[Security] should return 404 when accessing a task belonging to another organization', async () => {
    const foreignTaskId = 'id-from-different-org';

    const request = axios.get(`${API_URL}/tasks/${foreignTaskId}`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });

    // We throw 404 to avoid confirming the existence of IDs in other tenants
    await expect(request).rejects.toMatchObject({
      response: { status: 404 }
    });
  });

  // --- SECTION 3: FILTERING, SEARCHING & SORTING ---

  it('[Logic] should filter tasks by category via backend query params', async () => {
    const response = await axios.get(`${API_URL}/tasks`, {
      params: { category: 'WORK' },
      headers: { Authorization: `Bearer ${viewerToken}` }
    });

    expect(response.status).toBe(200);
    response.data.forEach((task: any) => {
      expect(task.category).toBe('WORK');
    });
  });

  it('[Logic] should perform a case-insensitive search (ILIKE validation)', async () => {
    const searchTerm = 'DATABASE'; // Testing uppercase search for lowercase content
    const response = await axios.get(`${API_URL}/tasks`, {
      params: { search: searchTerm },
      headers: { Authorization: `Bearer ${viewerToken}` }
    });

    expect(response.status).toBe(200);
    if (response.data.length > 0) {
      expect(response.data[0].title.toUpperCase()).toContain(searchTerm);
    }
  });

  // --- SECTION 4: AUTHENTICATION BASELINE ---

  it('[Auth] should return 401 Unauthorized when no token is provided', async () => {
    const request = axios.get(`${API_URL}/tasks`);
    await expect(request).rejects.toMatchObject({
      response: { status: 401 }
    });
  });

  it('[Auth] should return 401 for invalid credentials', async () => {
    const request = axios.post(`${API_URL}/auth/login`, {
      email: 'owner@test.com',
      password: 'wrongpassword'
    });
    await expect(request).rejects.toMatchObject({
      response: { status: 401 }
    });
  });
});