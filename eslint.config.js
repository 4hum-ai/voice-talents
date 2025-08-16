import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/recommended']
]


