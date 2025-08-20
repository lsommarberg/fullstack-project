const loginWith = async (page, username, password) => {
  await page.goto('/login');
  await page.getByTestId('username_login').fill(username);
  await page.getByTestId('password_login').fill(password);
  const fieldset = page.locator('fieldset');
  await fieldset.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/\/users\//i);
};

const addPattern = async (page, name) => {
  await page.getByTestId('sidebar-create-pattern').click();

  await page.getByLabel('Pattern Name').fill(name || 'Test Pattern');
  await page
    .getByLabel('Pattern Instructions')
    .fill('This is a test pattern description');
  await page.getByLabel('Pattern Link').fill('Link to pattern');
  await page.getByLabel('Tags').fill('tag1, tag2, tag3');
  await page.getByLabel('Additional Notes').fill('Test notes for this pattern');

  await page.getByTestId('create-pattern-button').click();
};

const addProject = async (page, name, date) => {
  await page.getByRole('button', { name: 'Start New' }).click();

  await page.getByLabel('Project Name').fill(name || 'Test Project');

  await page.getByLabel('Started At').fill(date || '2025-01-01');
  await page.getByTestId('tracker-section').fill('Main Section');
  await page.getByTestId('tracker-total-rows').fill('100');

  await page.getByLabel('Notes').fill('Test notes for this project');

  await page.getByTestId('create-project-button').click();
};

export { loginWith, addPattern, addProject };
