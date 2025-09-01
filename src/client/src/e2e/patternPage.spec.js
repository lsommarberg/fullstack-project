import { test, expect, describe, beforeEach } from '@playwright/test';
import { loginWith, addPattern } from './helper';

describe('Pattern Page', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await page.waitForTimeout(1000);
    await request.post('http://localhost:3001/api/signup', {
      data: {
        username: 'testuser3',
        password: 'test',
      },
    });
    await page.goto('http://localhost:5173/');
    await loginWith(page, 'testuser3', 'test');
  });

  test('user can view a pattern', async ({ page }) => {
    await addPattern(page);
    await expect(page.getByText('Pattern created successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/users\/\d+/);

    await page.getByRole('link', { name: 'My Patterns' }).click();

    await expect(page.getByText('Test Pattern')).toBeVisible();
    await page.getByText('Test Pattern').click();
    await expect(page).toHaveURL(/\/patterns\/\d+/);
    await expect(
      page.getByText('This is a test pattern description'),
    ).toBeVisible();
    await expect(page.getByText('Link to pattern')).toBeVisible();
    await expect(page.getByText('tag1')).toBeVisible();
    await expect(page.getByText('tag2')).toBeVisible();
    await expect(page.getByText('tag3')).toBeVisible();
    await expect(page.getByText('Test notes for this pattern')).toBeVisible();
  });

  test('user can delete a pattern', async ({ page }) => {
    await addPattern(page, 'To Delete');
    await expect(page).toHaveURL(/\/users\/\d+/);

    await page.getByRole('link', { name: 'My Patterns' }).click();

    await expect(page.getByText('To Delete')).toBeVisible();
    await page.getByText('To Delete').click();

    await page.getByRole('button', { name: 'Delete this pattern' }).click();

    await expect(
      page.getByText(
        'Are you sure you want to delete this pattern and all associated images? This action cannot be undone.',
      ),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page).toHaveURL(/\/patterns\/\d+/);
    await expect(page.getByText('Pattern deleted successfully')).toBeVisible();
  });

  test('User can edit a pattern', async ({ page }) => {
    await addPattern(page, 'To Edit');
    await expect(page).toHaveURL(/\/users\/\d+/);

    await page.getByRole('link', { name: 'My Patterns' }).click();

    await expect(page.getByText('To Edit')).toBeVisible();
    await page.getByText('To Edit').click();

    await page.getByRole('button', { name: 'Edit this pattern' }).click();

    await page.getByTestId('pattern-name-input').fill('Edited Pattern');
    await page.getByTestId('pattern-textarea').fill('Edited description');

    await page.getByTestId('save-button').click();

    await expect(page).toHaveURL(/\/patterns\/\d+/);
    await expect(page.getByText('Pattern updated successfully')).toBeVisible();
    await expect(page.getByText('Edited Pattern')).toBeVisible();
  });
});
