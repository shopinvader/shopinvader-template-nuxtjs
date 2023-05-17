<template>
  <div id="header-target"></div>
  <slot name="header">
    <header-vue></header-vue>
  </slot>
  <main>
    <div class="alert shadow-lg">
      <div>
        <h3 class="font-bold">{{ cart?.name }}</h3>
        <div class="text-xs">{{ cart?.uuid }}</div>
      </div>
    </div>
    <slot name="body"> </slot>
    <slot></slot>
  </main>
  <footer-vue></footer-vue>
  <notifications-vue></notifications-vue>
</template>
<script lang="ts">
import Header from '../components/global/Header.vue'
import Footer from '../components/global/Footer.vue'
import Notifications from '../components/global/Notifications.vue'

export default defineNuxtComponent({
  name: 'Default',
  components: {
    'header-vue': Header,
    'footer-vue': Footer,
    'notifications-vue': Notifications
  },
  setup() {
    const services = useShopinvaderServices()
    return {
      cart: services?.cart?.getCart()
    }
  }
})
</script>
<style lang="scss">
main {
  @apply container mx-auto;
}
</style>
