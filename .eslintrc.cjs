module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2024, sourceType: 'module' },
  plugins: ['@typescript-eslint', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier'
  ],
  env: {
    browser: true,
    node: true,
    es2024: true,
  },
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    indent: ['error', 'tab'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': ['warn'],
  },
};
