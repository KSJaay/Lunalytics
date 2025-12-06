module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],

  testMatch: ['**/?(*.)+(test|spec).ts?(x)'],

  // Helps Jest handle imports (especially in Vite projects)
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
