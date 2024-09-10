// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'prefer-const': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/html-self-closing': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/component-definition-name-casing': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/attributes-order': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'vue/no-v-html': 'off'
  }
})
