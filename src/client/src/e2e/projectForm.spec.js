import { test, expect, describe, beforeEach } from '@playwright/test';
import { loginWith, addProject } from './helper';

describe('Project Form', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/signup', {
      data: {
        username: 'testuser2',
        password: 'test',
      },
    });
    await page.goto('http://localhost:5173/');
    await loginWith(page, 'testuser2', 'test');
  });

  test('user can create a new project without a pattern', async ({ page }) => {
    await addProject(page);

    await expect(page.getByText('Project created successfully')).toBeVisible();

    await expect(page).toHaveURL(/\/projects\/\d+/);

    await page.getByRole('link', { name: 'My Projects' }).click();

    await expect(page.getByText('Test Project')).toBeVisible();
  });
});
