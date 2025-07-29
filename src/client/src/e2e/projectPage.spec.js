import { test, expect, describe, beforeEach } from '@playwright/test';
import { loginWith, addProject } from './helper';

describe('Project Page', () => {
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

  test('user can view a project', async ({ page }) => {
    await addProject(page);
    await expect(page.getByText('Project created successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/projects\/\d+/);

    await page.getByRole('link', { name: 'My Projects' }).click();

    await expect(page.getByText('Test Project')).toBeVisible();
    await page.getByText('Test Project').click();
    await expect(page).toHaveURL(/\/projects\/\d+/);
    await expect(page.getByText('Test notes for this project')).toBeVisible();
  });

  test('user can delete a project', async ({ page }) => {
    await addProject(page, 'To Delete');
    await expect(page).toHaveURL(/\/projects\/\d+/);

    await expect(page.getByText('To Delete')).toBeVisible();
    await page.getByText('To Delete').click();

    await page.getByRole('button', { name: 'Delete Project' }).click();

    await expect(
      page.getByText('Are you sure you want to delete this project?'),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page).toHaveURL(/\/projects\/\d+/);
    await expect(page.getByText('Project deleted successfully')).toBeVisible();
  });

  test('User can edit a project', async ({ page }) => {
    await addProject(page, 'To Edit');

    await expect(page).toHaveURL(/\/projects\/\d+/);
    await expect(page.getByText('To Edit')).toBeVisible();
    await page.getByText('To Edit').click();

    await page.getByRole('button', { name: 'Edit Project' }).click();

    await expect(page.getByText('Edit Project')).toBeVisible();
    await page.getByLabel('Project Name').fill('Edited Project');
    await page.getByLabel('Notes').fill('Edited notes for this project');

    await page.getByRole('button', { name: 'Save Changes' }).click();

    await expect(page.getByText('Project updated successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/projects\/\d+/);
    await expect(page.getByText('Edited Project')).toBeVisible();
    await expect(page.getByText('Edited notes for this project')).toBeVisible();
  });

  test('user can finish a project', async ({ page }) => {
    await addProject(page, 'To Finish');

    await expect(page).toHaveURL(/\/projects\/\d+/);
    await expect(page.getByText('To Finish')).toBeVisible();
    await page.getByText('To Finish').click();

    await page.getByRole('button', { name: 'Finish Project' }).click();

    await page.getByTestId('confirm-button').click();

    await expect(
      page.getByText('Project finished successfully!'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/projects\/\d+/);
    await expect(page.getByText('Finished on: 7/29/2025')).toBeVisible();
    await expect(page.getByText('Row Trackers')).not.toBeVisible();
    await page.getByText('My Projects').click();
    await expect(page.getByText('To Finish')).not.toBeVisible();
    await page.getByText('Finished Projects').click();
    await expect(page.getByText('To Finish')).toBeVisible();
  });
});
