import uni from '@uni-helper/eslint-config'

export default uni({
  rules: {
    'no-console': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
  },
  ignores: ['**/*.md'],
})
