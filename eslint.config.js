import { config } from '@fisch0920/config/eslint'

export default [
  ...config,
  {
    ignores: ['src/vendor/**']
  }
]
