module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.backend.config.js' }],
  },
  testMatch: ['**/db_tests/**/*.test.js'],
};
