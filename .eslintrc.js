module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'no-unused-vars': 'warn',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'jsx-a11y/label-has-associated-control': 'off',
    'max-len': ['error', { code: 200 }],
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'react/jsx-no-useless-fragment': 'off',
  },
};
