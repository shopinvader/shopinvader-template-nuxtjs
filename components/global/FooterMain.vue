<template>
  <footer class="footer">
    <div class="footer__logo">
      <slot name="logo">
        <logo></logo>
      </slot>
    </div>
    <div class="footer__content">
      <!-- @slot footer content -->
      <slot name="content"> </slot>
    </div>
  </footer>
</template>
<script lang="ts" setup></script>
<style lang="scss">
.footer {
  @apply container mx-auto border-t p-4 py-10;
  &__content {
    @apply flex flex-wrap justify-between;
  }
}
</style>
