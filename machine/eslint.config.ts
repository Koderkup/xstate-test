import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  stylistic: true,
  typescript: true,
  gitignore: true,
})
  .append({
    name: 'project',
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
      ],
      'vue/match-component-import-name': [
        'error',
      ],
      'vue/define-macros-order': [
        'error',
        {
          order: [
            'defineOptions',
            'defineModel',
            'defineProps',
            'defineEmits',
            'defineSlots',
          ],
          defineExposeLast: true,
        },
      ],
      'vue/require-explicit-slots': [
        'error',
      ],
      'vue/define-emits-declaration': [
        'error',
        'type-literal',
      ],
      'vue/block-order': [
        'error',
        {
          order: [
            'script',
            'template',
            'style',
          ],
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        { singleline: { max: 6 }, multiline: { max: 1 } },
      ],
      'vue/valid-template-root': 'off',
      'perfectionist/sort-imports': [
        'error',
        {
          internalPattern: ['^@\/.*'],
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index'],
          ],
        },
      ],
      'ts/no-empty-object-type': 'off',
      'style/operator-linebreak': [
        'error',
        'before',
        {
          overrides: {
            '=': 'after',
          },
        },
      ],
    },
  })
  .append({
    name: 'machine',
    files: ['configs/machine.ts'],
    rules: {
      'style/quote-props': [
        'error',
        'consistent',
      ],
    },
  })
