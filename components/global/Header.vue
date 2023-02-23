<template>
  <aside-menu name="header" class="header" class-content="header-navbar">
    <template #button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="inline-block h-6 w-6 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        ></path>
      </svg>
    </template>
    <template #title>
      <nuxt-link :to="localePath({ name: 'index' })" class="flex items-center">
        <logo :height="40" :width="50"></logo>
      </nuxt-link>
    </template>
    <template #content>
      <div class="content__search">
        <search-autocomplete></search-autocomplete>
      </div>
      <div class="content__icons">
        <cart-icon></cart-icon>
        <header-user></header-user>
        <div class="hidden md:flex">
          <local-switcher></local-switcher>
        </div>
      </div>
    </template>
    <template #menu>
      <div>
        <header-nav></header-nav>
      </div>
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
import SearchAutocomplete from '~/components/search/autocomplete/SearchAutocomplete.vue'
export default {
  name: 'global-header',
  components: {
    logo: Logo,
    'local-switcher': LocalSwitcher,
    'header-nav': HeaderNavVue,
    'aside-menu': AsideMenu,
    'cart-icon': CartIconVue,
    'header-user': HeaderUser,
    'search-autocomplete': SearchAutocomplete
  },

  async setup() {
    return {
      cart: computed(() => useCart())
    }
  }
}
</script>
<style lang="scss">
.header-navbar {
  @apply navbar mx-auto border-b p-0 pt-2 md:container;
  display: grid;
  grid-template-columns: auto auto 1fr 1fr auto;
  @apply grid-flow-row;

  .content {
    &__button {
      @apply col-start-1 col-end-1;
    }

    &__title {
      @apply col-start-2 col-end-2 lg:row-span-2;
    }

    &__menu {
      @apply col-start-3 col-end-6 row-start-2;
    }

    &__search {
      @apply col-start-1 col-end-5 max-md:row-start-2 max-md:bg-slate-100 md:col-start-3;
    }

    &__icons {
      @apply col-start-3 col-end-5 row-start-1 flex items-center justify-end px-2 md:col-start-5;
    }
  }
}
.header {
  @apply max-md:sticky max-md:-top-14 max-md:z-10 max-md:bg-white;
}
</style>
