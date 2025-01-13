const globals = require('globals');
const stylisticJs = require('@stylistic/eslint-plugin-js');
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
    },
  },
];
