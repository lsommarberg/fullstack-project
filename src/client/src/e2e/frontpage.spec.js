import { test, expect, describe, beforeEach } from '@playwright/test';
import { loginWith } from './helper';

describe('Frontpage', () => {
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

  test('homepage loads and displays login page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('legend')).toHaveText('Login');

    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();

    const fieldset = page.locator('fieldset');
    await expect(fieldset.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('user can sign up', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await page.getByTestId('username_signup').fill('test');
    await page.getByTestId('password_signup').fill('test');
    await page.getByTestId('password_signup_confirmation').fill('test');
    await page.getByTestId('signup_submit').click();
  });

  test('user can login', async ({ page }) => {
    await loginWith(page, 'testuser', 'test');
    await expect(page.getByText(/Welcome: testuser/i)).toBeVisible();
  });
});
