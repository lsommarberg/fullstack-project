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
    await expect(page.getByText('Test Project')).toBeVisible();
    await expect(page.getByText('Row Trackers')).toBeVisible();
    await expect(page.getByText('Main Section')).toBeVisible();
    await expect(page.getByText('tag1')).toBeVisible();
    await expect(page.getByText('tag2')).toBeVisible();
    await expect(page.getByText('tag3')).toBeVisible();
    await expect(page.getByText('Test notes for this project')).toBeVisible();
  });

  test('user can delete a project', async ({ page }) => {
    await addProject(page, 'To Delete');
    await expect(page).toHaveURL(/\/projects\/\d+/);

    await expect(page.getByText('To Delete')).toBeVisible();

    await page.getByRole('button', { name: 'Delete this project' }).click();

    await expect(
      page.getByText(
        'Are you sure you want to delete this project and all associated images? This action cannot be undone.',
      ),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Delete Project' }).click();

    await expect(page).toHaveURL(/\/projects\/\d+/);
    await expect(page.getByText('Project deleted successfully')).toBeVisible();
  });

  test('User can edit a project', async ({ page }) => {
    await addProject(page, 'To Edit');

    await expect(page).toHaveURL(/\/projects\/\d+/);

    await page.getByRole('button', { name: 'Edit this project' }).click();

    await expect(page.getByText('Edit Project')).toBeVisible();
    await page.getByLabel('Project Name').fill('Edited Project');
    await page.getByLabel('Notes').fill('Edited notes for this project');

    await page.getByRole('button', { name: 'Save project changes' }).click();

    await expect(page.getByText('Project updated successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/projects\/\d+/);
    await expect(page.getByText('Edited Project')).toBeVisible();
    await expect(page.getByText('Edited notes for this project')).toBeVisible();
  });

  test('user can finish a project', async ({ page }) => {
    await addProject(page, 'To Finish');

    await expect(page).toHaveURL(/\/projects\/\d+/);

    await page.getByRole('button', { name: 'Finish this project' }).click();

    await page.getByTestId('confirm-button').click();

    await expect(
      page.getByText('Project finished successfully!'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/projects\/\d+/);
    const currentDate = new Date().toLocaleDateString();
    await expect(page.getByText(currentDate)).toBeVisible();
    await expect(page.getByText('Row Trackers')).not.toBeVisible();
    await page.getByText('My Projects').click();
    await page.getByText('In progress').click();
    const inProgressPanel = page.getByTestId('projects-inprogress-panel');
    await expect(
      inProgressPanel.getByTestId('item-To Finish'),
    ).not.toBeVisible();
    await page.getByTestId('projects-finished-tab').click();
    const finishedPanel = page.getByTestId('projects-finished-panel');
    await expect(finishedPanel.getByTestId('item-To Finish')).toBeVisible();
  });
});
