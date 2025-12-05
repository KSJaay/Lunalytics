export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' }, // compile for current Node version
        modules: 'auto', // transpile ESM to CJS for Jest
      },
    ],
  ],
};
