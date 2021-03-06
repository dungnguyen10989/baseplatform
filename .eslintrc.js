module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    strict: 0,
    'no-use-before-define': 0,
    'no-case-declarations': 0,
    'no-catch-shadow': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'react-hooks/exhaustive-deps': 0,
    'no-unused-vars': 'off',
  },
};
