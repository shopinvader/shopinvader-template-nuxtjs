<template>
  <header :class="{ scrolled: scrolled }">
    <aside-menu
      name="header"
      class="header"
      class-content="header-navbar"
      :sideMenu="scrolled"
    >
      <template #button>
        <div class="text-primary">
          <icon
            icon="solar:hamburger-menu-outline"
            class="text-3xl text-primary"
          />
        </div>
      </template>
      <template #header>
        <logo></logo>
      </template>
      <template #title>
        <nuxt-link :to="localePath({ name: 'index' })" class="logo">
          <logo></logo>
        </nuxt-link>
      </template>
      <template #content>
        <slot name="content">
          <div class="content__search">
            <search-autocomplete></search-autocomplete>
          </div>
          <div class="content__icons">
            <cart-icon></cart-icon>
            <header-user></header-user>
            <local-switcher></local-switcher>
          </div>
        </slot>
      </template>
      <template #menu>
        <slot name="menu">
          <header-nav></header-nav>
        </slot>
      </template>
    </aside-menu>
  </header>
</template>
<script lang="ts">
import Logo from '~/components/global/Logo.vue'
import HeaderNavVue from '~/components/global/header/HeaderNav.vue'
import HeaderUser from '~/components/global/header/HeaderUser.vue'
import LocalSwitcher from '~/components/global/LocalSwitcher.vue'
import CartIconVue from '~/components/cart/CartIcon.vue'
import AsideMenu from '~/components/global/AsideMenu.vue'
import SearchAutocomplete from '~/components/search/autocomplete/SearchAutocomplete.vue'
export default defineNuxtComponent({
  name: 'GlobalHeader',
  components: {
    'local-switcher': LocalSwitcher,
    'header-nav': HeaderNavVue,
    'aside-menu': AsideMenu,
    'cart-icon': CartIconVue,
    'header-user': HeaderUser,
    'search-autocomplete': SearchAutocomplete,
    logo: Logo
  },
  data() {
    return {
      scrolled: false
    }
  },
  async setup() {
    const localePath = useLocalePath()
    const cartService = useShopinvaderService('cart')
    const cart = cartService.getCart()
    return {
      localePath,
      cart
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 0
    }
  }
})
</script>
<style lang="scss">
header {
  @apply sticky top-0 z-40 border-b bg-white pb-2;
  &.scrolled {
    @apply shadow-xl;
    .header-navbar {
      .logo {
        @apply max-w-lg;
        &__baseline {
          @apply hidden;
        }
      }
      .content {
        &__icons {
          .button {
            &__label {
              @apply opacity-0 transition-all duration-100 ease-in-out;
            }
          }
        }
      }
    }
  }
  .header-navbar {
    @apply navbar mx-auto  p-0 pt-2 lg:container lg:bg-transparent;
    display: grid;
    grid-template-columns: auto auto 1fr 1fr auto;
    @apply grid-flow-row;
    .content {
      &__button {
        @apply col-start-1 col-end-1;
      }

      &__title {
        @apply col-start-2 col-end-2 lg:row-span-2;
        .logo {
          @apply flex flex-col items-center;
          &__baseline {
            @apply max-md:hidden;
          }
        }
      }

      &__menu {
        @apply col-start-3 col-end-6 row-start-2;
      }

      &__search {
        @apply col-start-1 col-end-5 max-lg:row-start-2 max-lg:bg-slate-100 lg:col-start-3;
      }

      &__icons {
        @apply col-start-3 col-end-5 row-start-1 hidden items-center justify-end gap-2 px-2 md:flex lg:col-start-5;
        .button {
          &__icon {
            @apply rounded-full bg-primary p-1.5 text-4xl text-white;
          }
        }
      }
    }
  }

  .header {
    @apply max-md:sticky max-md:-top-14 max-md:z-10 max-md:bg-white;
  }
}
</style>
