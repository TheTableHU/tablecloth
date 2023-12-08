// eslintrc.js

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '18.2.0',
    },
  },
  overrides: [
    {
      // Overrides for frontend code
      files: ['frontend/**/*.js', 'frontend/**/*.jsx'],
      env: {
        browser: true,
      },
    },
    {
      // Overrides for backend code
      files: ['backend/**/*.js'],
      env: {
        node: true,
      },
    },
  ],
};
