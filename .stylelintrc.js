module.exports = {
  extends: ['stylelint-config-twbs-bootstrap'],
  ignoreFiles: ['./**/iconfont.css', './**/reset.scss'],
  rules: {
    'number-leading-zero': 'always', // 兼容prettier
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }], // 支持全局:global
    'declaration-no-important': null, // 不推荐使用import 但是允许使用import
  },
};
