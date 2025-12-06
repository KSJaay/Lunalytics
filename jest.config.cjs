module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // use babel-jest for all files
  },

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],

  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],

  // Helps Jest handle imports (especially in Vite projects)
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  setupFiles: ['<rootDir>/jest.setup.js'],
};
