<template>
  <footer class="footer p-10 border-t text-base-content">
    <div>
      <logo></logo>
      FOOTER
    </div>
  </footer>
</template>
<script lang="ts">
import Logo from '~/components/global/Logo.vue'
export default {
  name: 'Footer',
  components: {
    'logo': Logo
  }
}
</script>
<style lang="scss">
.footer {
  @apply container border-t mx-auto px-4 sm:px-6 md:px-8;
}
</style>