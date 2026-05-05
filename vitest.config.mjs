import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    include: ['test/server/**/*.test.{js,jsx,ts,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      'test/_helpers/**',
      'test/e2e/**',
      'test/shared/**',
    ],
    setupFiles: ['test/_helpers/setup.ts'],
    testTimeout: 10_000,
    hookTimeout: 15_000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
      },
    },
    coverage: {
      provider: 'v8',
      include: ['server/**/*.{js,ts}', 'shared/**/*.{js,ts}'],
      exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/dist/**',
        'server/index.ts',
        '**/*.d.ts',
      ],
      reporter: ['text', 'html', 'lcov'],
    },
  },
});
