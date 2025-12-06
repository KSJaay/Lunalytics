module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // use babel-jest for all files
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
