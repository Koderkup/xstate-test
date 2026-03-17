/** @types {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-property-sort-order-smacss',
  ],
  overrides: [
    {
      files: ['**/*.vue'],
      extends: [
        'stylelint-config-recommended-vue/scss',
        'stylelint-config-property-sort-order-smacss',
      ],
    },
    {
      files: ['**/*.scss'],
      extends: [
        'stylelint-config-recommended-scss',
        'stylelint-config-property-sort-order-smacss',
      ],
    },
  ],
  rules: {
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
  },
}
