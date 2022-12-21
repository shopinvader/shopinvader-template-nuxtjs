<template>
  <aside-menu name="header" class-content="navbar border-b container mx-auto">
    <template #button>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </template>
    <template #title>
      <nuxt-link :to="localePath({ name: 'index' })" class="flex items-center">
        <logo :height="100" :width="240"></logo>
      </nuxt-link>
    </template>
    <template #menu>
      <header-nav></header-nav>
    </template>
    <template #content>
      <cart-icon></cart-icon>
      <header-user></header-user>
      <local-switcher></local-switcher>
    </template>
  </aside-menu>
</template>
<script lang="ts">
  import Logo from '~/components/global/Logo.vue'
  import LocalSwitcher from '~/components/global/LocalSwitcher.vue'
  import HeaderNavVue from './HeaderNav.vue'
  import CartIconVue from '../cart/CartIcon.vue'
  import AsideMenu from './AsideMenu.vue'
  import HeaderUser from './HeaderUser.vue'
  export default {
    name: 'Header',
    components: {
      'logo': Logo,
      'local-switcher': LocalSwitcher,
      'header-nav': HeaderNavVue,
      'aside-menu': AsideMenu,
      'cart-icon': CartIconVue,
      'header-user': HeaderUser
    },

    async setup(props) {
      return {
        cart : computed(() => useCart())
      }
    }
  }
</script>
<style lang="scss">
  .header {
    @apply container border-b mx-auto px-4 sm:px-6 md:px-8 flex;
  }
</style>
