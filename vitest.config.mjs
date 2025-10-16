import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    include: ['test/server/**/*.test.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      include: [
        'server/**/*.{js,ts}',
        'shared/**/*.{js,ts}',
        'scripts/**/*.{js,ts}',
      ],
      exclude: ['**/node_modules/**', '**/test/**', '**/dist/**'],
    },
  },
});
