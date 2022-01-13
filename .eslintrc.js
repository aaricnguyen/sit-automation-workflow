module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-underscore-dangle': 0,
    'react/no-array-index-key': 0,
    'react-hooks/exhaustive-deps': 0,
  },
};
