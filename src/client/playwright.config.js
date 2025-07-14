const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src/e2e',
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },

  webServer: [
    {
      command: 'npm run start:test',
      cwd: '../server',
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev',
      cwd: '.',
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
