'use strict';

module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended'],
  plugins: ['import'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn'
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-restricted-globals': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false
          }
        ]
      }
    }
  ]
};
