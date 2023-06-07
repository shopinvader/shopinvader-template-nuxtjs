<template>
  <div id="app">
    <div id="header-target"></div>
    <slot name="header">
      <header-vue></header-vue>
    </slot>
    <main>
      <slot name="body"> </slot>
      <slot></slot>
    </main>
    <footer-vue></footer-vue>
    <notifications-vue></notifications-vue>
  </div>
</template>
<script lang="ts">
import Header from '~/components/global/Header.vue'
import Footer from '~/components/global/Footer.vue'
import Notifications from '~/components/global/Notifications.vue'

export default defineNuxtComponent({
  name: 'Default',
  components: {
    'header-vue': Header,
    'footer-vue': Footer,
    'notifications-vue': Notifications
  }
})
</script>
<style lang="scss">
main {
  @apply container mx-auto flex-grow;
}
#app {
  @apply flex min-h-screen flex-col;
}
</style>
