import { test, expect, describe, beforeEach } from '@playwright/test';
import { loginWith } from './helper';

describe('Pattern Form', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/signup', {
      data: {
        username: 'testuser',
        password: 'test',
      },
    });
    await page.goto('http://localhost:5173/');
  });

  test('user can create a new pattern', async ({ page }) => {
    await loginWith(page, 'testuser', 'test');

    await page.getByRole('button', { name: 'Create Pattern' }).click();

    await page.getByLabel('Name').fill('Test Pattern');
    await page.getByLabel('Text').fill('This is a test pattern description');
    await page.getByLabel('Link').fill('https://example.com');
    await page.getByLabel('Tags').fill('test, example, pattern');
    await page.getByLabel('Notes').fill('Test notes for this pattern');

    await page.getByTestId('create-pattern-button').click();

    await expect(page.getByText('Pattern created successfully')).toBeVisible();

    await expect(page).toHaveURL(/\/users\/\d+/);

    await page.getByRole('link', { name: 'My Patterns' }).click();

    await expect(page.getByText('Test Pattern')).toBeVisible();
  });
});
