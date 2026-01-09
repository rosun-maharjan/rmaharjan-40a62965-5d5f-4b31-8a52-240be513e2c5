import { test, expect } from '@playwright/test';

test.describe('TurboVets Secure Portal - End-to-End Suite', () => {

  /**
   * TEST: LOGIN COMPONENT
   * Verifies Auth flow and JWT storage
   */
  test('should login successfully as an Owner and see the dashboard', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'owner@test.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Verify Redirect & Navbar
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('nav')).toContainText('owner@test.com');
    await expect(page.locator('nav')).toContainText('OWNER');
  });

  /**
   * TEST: TASK LIST (KANBAN) & DRAG-AND-DROP
   * Verifies the core feature of the app
   */
  test('should display columns and handle drag-and-drop', async ({ page }) => {
    // Shared login utility or manual login
    await loginAs(page, 'owner@test.com');

    // Check for Kanban columns
    await expect(page.locator('h2:has-text("Todo")')).toBeVisible();
    await expect(page.locator('h2:has-text("Doing")')).toBeVisible();
    await expect(page.locator('h2:has-text("Done")')).toBeVisible();

    // Perform Drag and Drop
    const firstTask = page.locator('[cdkdrag]').first();
    const doingColumn = page.locator('div:has(h2:has-text("Doing")) [cdkdroplist]');
    
    await firstTask.dragTo(doingColumn);
    
    // Verify move (Visual check)
    await expect(doingColumn).toContainText(await firstTask.innerText());
  });

  /**
   * TEST: ADD TASK COMPONENT
   * Verifies form validation and submission
   */
  test('should create a new task successfully', async ({ page }) => {
    await loginAs(page, 'admin@test.com');
    await page.click('text=+ New Task');

    const uniqueTitle = `Automation Task ${Date.now()}`;
    await page.fill('input[formControlName="title"]', uniqueTitle);
    await page.fill('textarea[formControlName="description"]', 'E2E Test Description');
    await page.selectOption('select[formControlName="category"]', 'WORK');
    
    await page.click('button:has-text("Create Task")');

    // Verify redirect and appearance in list
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('text=' + uniqueTitle)).toBeVisible();
  });

  /**
   * TEST: EDIT TASK COMPONENT
   * Verifies data fetching and PUT requests
   */
  test('should edit an existing task', async ({ page }) => {
    await loginAs(page, 'owner@test.com');
    
    // Click edit on the first visible task card
    await page.locator('a[href*="/edit-task"]').first().click();
    
    const titleInput = page.locator('input[formControlName="title"]');
    await titleInput.clear();
    await titleInput.fill('Updated Title via E2E');
    
    await page.click('button:has-text("Save Changes")');
    
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('text=Updated Title via E2E')).toBeVisible();
  });

  /**
   * TEST: AUDIT LOG COMPONENT
   * Verifies RBAC visibility and data fetching
   */
  test('should display audit logs for Admin/Owner', async ({ page }) => {
    await loginAs(page, 'admin@test.com');
    
    await page.click('text=Audit Logs');
    await expect(page).toHaveURL('/audit-logs');
    
    // Verify the terminal-style table headers
    await expect(page.locator('text=Action / Performed By')).toBeVisible();
    
    // Verify log entries exist (assuming seed data)
    const logEntries = page.locator('.font-mono');
    await expect(logEntries).toBeVisible();
  });

  /**
   * TEST: VIEWER ROLE RESTRICTIONS
   * Verifies that the UI correctly hides restricted elements
   */
  test('should restrict Viewer from seeing restricted buttons', async ({ page }) => {
    await loginAs(page, 'viewer@test.com');
    
    // 1. Navbar should NOT have Audit Logs
    await expect(page.locator('text=Audit Logs')).not.toBeVisible();
    
    // 2. Task List should NOT have New Task button
    await expect(page.locator('text=+ New Task')).not.toBeVisible();
    
    // 3. Task Cards should NOT have Delete/Edit icons
    await expect(page.locator('svg.text-red-600')).not.toBeVisible();
  });
});

/**
 * HELPER: Reuseable Login Logic
 */
async function loginAs(page: any, email: string) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/tasks');
}