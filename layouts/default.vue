<template>
  <header-vue></header-vue>
  <main>
    <slot></slot>
  </main>
  <footer-vue></footer-vue>
</template>
<script lang="ts">
import Header from '../components/global/Header.vue'
import Footer from '../components/global/Footer.vue'
export default {
  name: 'Default',
  components: {
    'header-vue': Header,
    'footer-vue': Footer
  }
}
</script>
<style lang="scss">
main {
  @apply container mx-auto;
}
</style>
