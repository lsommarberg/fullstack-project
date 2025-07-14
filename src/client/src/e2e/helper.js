const loginWith = async (page, username, password) => {
  await page.goto('/login');
  await page.getByTestId('username_login').fill(username);
  await page.getByTestId('password_login').fill(password);
  const fieldset = page.locator('fieldset');
  await fieldset.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/\/users\//i);
};

export { loginWith };
