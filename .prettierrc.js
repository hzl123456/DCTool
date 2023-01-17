// https://manual.k8s-new.qunhequnhe.com/qunhe-lintrc
// module.exports = require('@qunhe/prettier-config-qunhe');
module.exports = {
  endOfLine: 'lf',
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',
  printWidth: 120,
  overrides: [
    {
      files: '*.{css,less,scss,json,html,yml,yaml,pcss}',
      options: {
        singleQuote: false,
      },
    },
  ],
};
