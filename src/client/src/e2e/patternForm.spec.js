import { test, expect, describe, beforeEach } from '@playwright/test';
import { loginWith, addPattern } from './helper';

describe('Pattern Form', () => {
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

  test('user can create a new pattern', async ({ page }) => {
    await addPattern(page);

    await expect(page.getByText('Pattern created successfully')).toBeVisible();

    await expect(page).toHaveURL(/\/users\/\d+/);

    await page.getByRole('link', { name: 'My Patterns' }).click();

    await expect(page.getByText('Test Pattern')).toBeVisible();
  });

  test('pattern creation form has image upload functionality', async ({
    page,
  }) => {
    await page.getByTestId('sidebar-create-pattern').click();

    await expect(page.getByText('Pattern Images')).toBeVisible();
    await expect(page.getByText('Upload Pattern Image')).toBeVisible();

    await expect(page.getByText('Upload Pattern Image')).toBeEnabled();
  });
});
