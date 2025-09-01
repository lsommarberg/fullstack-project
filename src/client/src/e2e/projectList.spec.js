import { test, expect, describe, beforeEach } from '@playwright/test';
import { loginWith, addProject } from './helper';

describe('Project List', () => {
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
    await addProject(page, 'First');
    await addProject(page, 'Second', '2024-10-02');
    await addProject(page, 'Third', '2023-10-03');
  });

  test('should display added projects', async ({ page }) => {
    await page.getByRole('link', { name: 'My Projects' }).click();
    await expect(page.getByTestId('projects-title')).toBeVisible();
    await expect(page).toHaveURL(/\/projects/);
    const listContainer = page.locator('[data-testid="projects-all-panel"]');
    const projects = listContainer.locator('[data-testid^="item-"]');
    await expect(projects).toHaveCount(3);
    await expect(projects.nth(0)).toContainText('First');
    await expect(projects.nth(1)).toContainText('Second');
    await expect(projects.nth(2)).toContainText('Third');
  });

  test('should search projects by name', async ({ page }) => {
    await page.getByRole('link', { name: 'My Projects' }).click();
    await expect(page.getByTestId('projects-title')).toBeVisible();
    await expect(page).toHaveURL(/\/projects/);

    const searchInput = page.getByPlaceholder('Search projects');
    await searchInput.fill('First');
    await page.getByTestId('projects-search-button').click();
    const listContainer = page.locator('[data-testid="projects-all-panel"]');
    const projects = listContainer.locator('[data-testid^="item-"]');

    await expect(projects).toHaveCount(1);
    await expect(projects.nth(0)).toContainText('First');
    await expect(projects.nth(0)).not.toContainText('Second');
    await expect(projects.nth(0)).not.toContainText('Third');
  });

  test('should handle no projects found', async ({ page }) => {
    await page.getByRole('link', { name: 'My Projects' }).click();
    const searchInput = page.getByPlaceholder('Search projects');
    await searchInput.fill('NonExistentProject');
    await page.getByTestId('projects-search-button').click();

    const listContainer = page.locator('[data-testid="projects-all-panel"]');
    const projects = listContainer.locator('[data-testid^="item-"]');

    await expect(projects).toHaveCount(0);
    await expect(listContainer.getByText('No results found')).toBeVisible();
  });

  test('should clear search results', async ({ page }) => {
    await page.getByRole('link', { name: 'My Projects' }).click();
    const searchInput = page.getByPlaceholder('Search projects');
    await searchInput.fill('First');
    await page.getByTestId('projects-search-button').click();

    const listContainer = page.locator('[data-testid="projects-all-panel"]');
    const projects = listContainer.locator('[data-testid^="item-"]');

    await expect(projects).toHaveCount(1);
    await expect(projects.nth(0)).toContainText('First');

    await page.getByRole('button', { name: 'Clear Search' }).click();
    await expect(searchInput).toHaveValue('');

    const allProjects = listContainer.locator('[data-testid^="item-"]');
    await expect(allProjects).toHaveCount(3);
  });

  test('should navigate to chosen project page after search', async ({
    page,
  }) => {
    await page.getByRole('link', { name: 'My Projects' }).click();
    const searchInput = page.getByPlaceholder('Search projects');
    await searchInput.fill('First');
    await page.getByTestId('projects-search-button').click();

    const listContainer = page.locator('[data-testid="projects-all-panel"]');
    const projects = listContainer.locator('[data-testid^="item-"]');

    await expect(projects).toHaveCount(1);
    await expect(projects.nth(0)).toContainText('First');

    await projects.nth(0).click();
    await expect(page.getByText('Notes for this project')).toBeVisible();
    await expect(page).toHaveURL(/\/projects\/\d+/);
  });

  test('should search projects by date range', async ({ page }) => {
    await page.getByRole('link', { name: 'My Projects' }).click();

    await page.getByRole('button', { name: 'Show Advanced Filters' }).click();
    await expect(page.getByText('Started Between')).toBeVisible();
    await expect(page.getByText('Finished Between')).toBeVisible();

    await page.getByTestId('started-after-input').fill('2024-01-01');
    await page.getByTestId('started-before-input').fill('2025-12-31');

    await page.getByTestId('projects-search-button').click();
    const listContainer = page.locator('[data-testid="projects-all-panel"]');
    const projects = listContainer.locator('[data-testid^="item-"]');
    await expect(projects).toHaveCount(2);
    await expect(projects.nth(0)).toContainText('First');
    await expect(projects.nth(1)).toContainText('Second');
  });

  test('should handle no projects found for date range', async ({ page }) => {
    await page.getByRole('link', { name: 'My Projects' }).click();

    await page.getByRole('button', { name: 'Show Advanced Filters' }).click();
    await expect(page.getByText('Started Between')).toBeVisible();
    await expect(page.getByText('Finished Between')).toBeVisible();

    await page.getByTestId('started-after-input').fill('2022-01-01');
    await page.getByTestId('started-before-input').fill('2022-12-31');

    await page.getByTestId('projects-search-button').click();
    const listContainer = page.locator('[data-testid="projects-all-panel"]');
    const projects = listContainer.locator('[data-testid^="item-"]');

    await expect(projects).toHaveCount(0);
    await expect(listContainer.getByText('No results found')).toBeVisible();
  });

  test('should handle partial match in search', async ({ page }) => {
    await page.getByRole('link', { name: 'My Projects' }).click();
    const searchInput = page.getByPlaceholder('Search projects');
    await searchInput.fill('Fir');
    await page.getByTestId('projects-search-button').click();

    const listContainer = page.locator('[data-testid="projects-all-panel"]');
    const projects = listContainer.locator('[data-testid^="item-"]');

    await expect(projects).toHaveCount(1);
    await expect(projects.nth(0)).toContainText('First');
  });

  test('should handle case insensitivity in search', async ({ page }) => {
    await page.getByRole('link', { name: 'My Projects' }).click();
    const searchInput = page.getByPlaceholder('Search projects');
    await searchInput.fill('firsT');
    await page.getByTestId('projects-search-button').click();

    const listContainer = page.locator('[data-testid="projects-all-panel"]');
    const projects = listContainer.locator('[data-testid^="item-"]');

    await expect(projects).toHaveCount(1);
    await expect(projects.nth(0)).toContainText('First');
  });

  test('should combine search and date filters', async ({ page }) => {
    await page.getByRole('link', { name: 'My Projects' }).click();

    await page.getByRole('button', { name: 'Show Advanced Filters' }).click();
    await expect(page.getByText('Started Between')).toBeVisible();
    await expect(page.getByText('Finished Between')).toBeVisible();

    await page.getByTestId('started-after-input').fill('2024-01-01');
    await page.getByTestId('started-before-input').fill('2025-12-31');
    await page.getByTestId('projects-search-button').click();

    const listContainer = page.locator('[data-testid="projects-all-panel"]');
    const projects = listContainer.locator('[data-testid^="item-"]');
    await expect(projects).toHaveCount(2);
    await expect(projects.nth(0)).toContainText('First');
    await expect(projects.nth(1)).toContainText('Second');

    const searchInput = page.getByPlaceholder('Search projects');
    await searchInput.fill('Second');
    await page.getByTestId('projects-search-button').click();

    await expect(projects).toHaveCount(1);
    await expect(projects.nth(0)).toContainText('Second');
  });
});
