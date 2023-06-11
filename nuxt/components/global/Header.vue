<template>
  <info-banner :infos="header?.preheader" />
  <header :class="{ scrolled: scrolled }">
    <aside-menu
      name="header"
      class="header"
      class-content="header-navbar"
      :sideMenu="scrolled"
    >
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
      <template #header>
        <cms-image v-if="header?.logo" :image="header.logo"></cms-image>
      </template>
      <template #title>
        <nuxt-link :to="localePath({ name: 'index' })" class="logo">
          <cms-image v-if="header?.logo" :image="header.logo"></cms-image>
          <div v-if="header?.baseline" class="logo__baseline">
            {{ header.baseline }}
          </div>
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
import Image from '~/components/cms/shared/Image.vue'
import LocalSwitcher from '~/components/global/LocalSwitcher.vue'
import HeaderNavVue from './HeaderNav.vue'
import CartIconVue from '../cart/CartIcon.vue'
import AsideMenu from './AsideMenu.vue'
import HeaderUser from './HeaderUser.vue'
import SearchAutocomplete from '~/components/search/autocomplete/SearchAutocomplete.vue'
import { Header } from '~/models/cms/Header'
export default defineNuxtComponent({
  name: 'global-header',
  fetchKey: 'header',
  components: {
    'cms-image': Image,
    'local-switcher': LocalSwitcher,
    'header-nav': HeaderNavVue,
    'aside-menu': AsideMenu,
    'cart-icon': CartIconVue,
    'header-user': HeaderUser,
    'search-autocomplete': SearchAutocomplete
  },
  data() {
    return {
      header: {} as Header,
      scrolled: false
    }
  },
  async asyncData() {
    const { getHeader } = useCMS()
    return {
      header: await getHeader()
    }
  },
  async setup() {
    const cartService = useShopinvaderService('cart')
    const cart = cartService.getCart()
    return {
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
        @apply col-start-3 col-end-5 row-start-1 flex items-center justify-end gap-2 px-2 lg:col-start-5;
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
