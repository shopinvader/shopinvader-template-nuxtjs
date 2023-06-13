<template>
  <footer class="footer">
    <div class="footer__logo">
      <slot name="logo">
        <brand-logo></brand-logo>
      </slot>
    </div>
    <div class="footer__content">
      <!-- @slot footer content -->
      <slot name="content"> </slot>
    </div>
  </footer>
</template>
<script lang="ts">
import Logo from '~/components/global/Logo.vue'
export default defineNuxtComponent({
  name: 'global-footer',
  components: {
    'brand-logo': Logo
  }
})
</script>
<style lang="scss">
.footer {
  @apply container mx-auto border-t p-4 py-10;
  &__logo {
  }
  &__content {
    @apply flex flex-wrap justify-between;
  }
}
</style>
