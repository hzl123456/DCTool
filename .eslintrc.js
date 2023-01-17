// http://manual.k8s-new.qunhequnhe.com/qunhe-lintrc
// module.exports = {
//   extends: [
//     // '@qunhe/eslint-config-qunhe',
//     // '@qunhe/eslint-config-qunhe/react',
//     // '@qunhe/eslint-config-qunhe/typescript',
//   ],
// };

module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: ['react-app', 'plugin:prettier/recommended', 'react-app/jest'],
  rules: {
    'no-var': 'error',
    'prefer-const': 'error',
    'object-shorthand': 'error',
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
    ],
    'no-promise-executor-return': 'error',
    'import/order': [
      'error',
      {
        groups: ['type', 'builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always-and-inside-groups',
        warnOnUnassignedImports: true,
        pathGroupsExcludedImportTypes: ['type'],
        pathGroups: [
          {
            pattern: '@common/plugins/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@common/hooks/**',
            group: 'external',
            position: 'after',
          },
          /* 应用层服务 */
          {
            pattern: '@common/services/**',
            group: 'external',
            position: 'after',
          },
          /* 领域层 */
          {
            pattern: '@common/domain/**',
            group: 'external',
            position: 'after',
          },
          /* 基础层 */
          {
            pattern: '@common/infraServices/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@common/utils/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@common/const/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@common/enums/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@common/components/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@common/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@src/pages/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@src/**',
            group: 'external',
            position: 'after',
          },
        ],
      },
    ],
    // eslint-config-alloy 推荐
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'static-field',
          'public-static-method',
          'protected-static-method',
          'private-static-method',
          'static-method',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'public-field',
          'protected-field',
          'private-field',
          'instance-field',
          'field',
          'constructor',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method',
          'public-method',
          'protected-method',
          'private-method',
          'instance-method',
          'method',
        ],
      },
    ],
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    'import/no-cycle': 'error',
    // react 相关
    'react/jsx-key': 'error',
    // jsx-runtime 新版本支持
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // hooks error
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
