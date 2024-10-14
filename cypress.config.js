import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:2308',
    viewportWidth: 1920,
    viewportHeight: 1080,
    specPattern: 'test/e2e/**/*.test.{js,jsx,ts,tsx}',
    fixturesFolder: 'test/e2e/setup/fixtures',
    screenshotsFolder: 'test/e2e/setup/screenshots',
    videosFolder: 'test/e2e/setup/videos',
    downloadsFolder: 'test/e2e/setup/downloads',
    supportFile: 'test/e2e/setup/support/e2e.js',
    experimentalRunAllSpecs: true,
  },
});
