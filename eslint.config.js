import antfu from '@antfu/eslint-config'
import tsdoc from 'eslint-plugin-tsdoc'

export default antfu({
  formatters: true,
  // react: true,
  ignores: [
    'plugins/docs/public/api.json',
    'packages/toolbox/dist',
    'packages/toolbox/docs',
    'packages/toolbox/scripts/*.cjs',
    'packages/toolbox/scripts/index.cjs',
  ],
}, {
  plugins: {
    tsdoc,
  },
  rules: {
    'no-console': 'off',
  },
})
