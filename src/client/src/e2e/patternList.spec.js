import { test, expect, describe, beforeEach } from '@playwright/test';
import { loginWith, addPattern } from './helper';

describe('Pattern List', () => {
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
    await addPattern(page, 'First');
    await addPattern(page, 'Second');
    await addPattern(page, 'Third');
  });

  test('should display added patterns', async ({ page }) => {
    await page.getByRole('link', { name: 'My Patterns' }).click();
    await expect(page.getByTestId('patterns-title')).toBeVisible();
    await expect(page).toHaveURL(/\/patterns/);
    const listContainer = page.locator('[data-testid="patterns-list"]');
    const patterns = listContainer.locator('[data-testid^="item-"]');
    await expect(patterns).toHaveCount(3);
    await expect(patterns.nth(0)).toContainText('First');
    await expect(patterns.nth(1)).toContainText('Second');
    await expect(patterns.nth(2)).toContainText('Third');
  });

  test('should search patterns', async ({ page }) => {
    await page.getByRole('link', { name: 'My Patterns' }).click();
    const searchInput = page.getByPlaceholder('Search patterns...');
    await searchInput.fill('First');
    await page.getByRole('button', { name: 'Search' }).click();

    const listContainer = page.locator('[data-testid="patterns-list"]');
    const patterns = listContainer.locator('[data-testid^="item-"]');

    await expect(patterns).toHaveCount(1);
    await expect(patterns.nth(0)).toContainText('First');
    await expect(page.getByText('No patterns yet')).not.toBeVisible();
    await expect(page.getByText('Second')).not.toBeVisible();
    await expect(page.getByText('Third')).not.toBeVisible();
  });

  test('should handle no patterns found', async ({ page }) => {
    await page.getByRole('link', { name: 'My Patterns' }).click();
    const searchInput = page.getByPlaceholder('Search patterns...');
    await searchInput.fill('NonExistentPattern');
    await page.getByRole('button', { name: 'Search' }).click();

    const listContainer = page.locator('[data-testid="patterns-list"]');
    const patterns = listContainer.locator('[data-testid^="item-"]');

    await expect(patterns).toHaveCount(0);
    await expect(page.getByText('No patterns yet')).toBeVisible();
  });

  test('should navigate to chosen pattern page after search', async ({
    page,
  }) => {
    await page.getByRole('link', { name: 'My Patterns' }).click();
    const searchInput = page.getByPlaceholder('Search patterns...');
    await searchInput.fill('First');
    await page.getByRole('button', { name: 'Search' }).click();

    const listContainer = page.locator('[data-testid="patterns-list"]');
    const patterns = listContainer.locator('[data-testid^="item-"]');

    await expect(patterns).toHaveCount(1);
    await expect(patterns.nth(0)).toContainText('First');

    await patterns.nth(0).click();
    await expect(page).toHaveURL(/\/patterns\/\d+/);
    await expect(
      page.getByRole('button', { name: 'Delete Pattern' }),
    ).toBeVisible();
  });
});
