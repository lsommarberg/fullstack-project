const loginWith = async (page, username, password) => {
  await page.goto('/login');
  await page.getByTestId('username_login').fill(username);
  await page.getByTestId('password_login').fill(password);
  const fieldset = page.locator('fieldset');
  await fieldset.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/\/users\//i);
};

const addPattern = async (page, name) => {
  await page.getByRole('button', { name: 'Create Pattern' }).click();

  await page.getByLabel('Name').fill(name || 'Test Pattern');
  await page.getByLabel('Text').fill('This is a test pattern description');
  await page.getByLabel('Link').fill('Link to pattern');
  await page.getByLabel('Tags').fill('tag1, tag2, tag3');
  await page.getByLabel('Notes').fill('Test notes for this pattern');

  await page.getByTestId('create-pattern-button').click();
};

export { loginWith, addPattern };
