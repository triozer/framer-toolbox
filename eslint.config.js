import antfu from '@antfu/eslint-config'
import tsdoc from 'eslint-plugin-tsdoc'

export default antfu({
  formatters: true,
  // react: true,
}, {
  plugins: {
    tsdoc,
  },
  rules: {
    'no-console': 'off',
  },
})
