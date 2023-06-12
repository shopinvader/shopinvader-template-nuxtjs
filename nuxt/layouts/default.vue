<template>
  <div id="app">
    <div id="header-target"></div>
    <slot name="header">
      <global-header></global-header>
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
import GlobalHeader from '~/components/global/header/Header.vue'
import Footer from '~/components/global/Footer.vue'
import Notifications from '~/components/global/Notifications.vue'

export default defineNuxtComponent({
  name: 'Default',
  components: {
    'global-header': GlobalHeader,
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
