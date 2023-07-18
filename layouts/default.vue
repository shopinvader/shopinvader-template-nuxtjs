<template>
  <div id="app">
    <div id="header-target"></div>
    <slot name="header">
      <header-main></header-main>
    </slot>
    <main>
      <slot name="body"> </slot>
      <slot></slot>
    </main>
    <footer-main></footer-main>
    <navbar-bottom class="md:hidden"></navbar-bottom>
    <notifications-vue></notifications-vue>
  </div>
</template>
<script lang="ts">
import HeaderMain from '~/components/global/header/HeaderMain.vue'
import FooterMain from '~/components/global/FooterMain.vue'
import Notifications from '~/components/global/Notifications.vue'
import NavbarBottomVue from '~/components/global/NavbarBottom.vue'
export default defineNuxtComponent({
  name: 'Default',
  components: {
    'header-main': HeaderMain,
    'footer-main': FooterMain,
    'notifications-vue': Notifications,
    'navbar-bottom': NavbarBottomVue,
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
