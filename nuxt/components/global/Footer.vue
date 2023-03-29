<template>
  <footer class="footer border-t p-10 text-base-content">
    <div>
      <logo></logo>
      FOOTER
    </div>
  </footer>
</template>
<script lang="ts">
import Logo from '~/components/global/Logo.vue'
export default {
  name: 'global-footer',
  components: {
    logo: Logo
  }
}
</script>
<style lang="scss">
.footer {
  @apply container mx-auto border-t px-4 sm:px-6 md:px-8;
}
</style>
