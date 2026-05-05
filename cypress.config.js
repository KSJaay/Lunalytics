import { defineConfig } from 'cypress';

const isCI = !!process.env.CI;

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:2308',
    viewportWidth: 1920,
    viewportHeight: 1080,
    specPattern: 'test/e2e/**/*.test.{js,jsx,ts,tsx}',
    fixturesFolder: 'test/e2e/setup/fixtures',
    screenshotsFolder: 'test/e2e/setup/screenshots',
    videosFolder: 'test/e2e/setup/videos',
    downloadsFolder: 'test/e2e/setup/downloads',
    supportFile: 'test/e2e/setup/support/e2e.js',
    experimentalRunAllSpecs: true,

    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,

    retries: {
      runMode: isCI ? 2 : 1,
      openMode: 0,
    },

    video: false,
    screenshotOnRunFailure: true,

    env: {
      ownerEmail: 'owner@lunalytics.xyz',
      ownerPassword: 'Lunalytics12345!$#',
      apiBase: '/api',
    },
  },
});
