module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: 'current' }, modules: 'auto' } // auto converts ESM to CJS for Jest
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ]
};
