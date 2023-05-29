<template>
  <header class="header-lite">
    <div class="header-lite__content">
      <slot name="logo" :header="header">
        <nuxt-link :to="{ path: '/' }">
          <cms-image
            v-if="header?.logo"
            :image="header.logo"
            class="content__logo"
          ></cms-image>
        </nuxt-link>
      </slot>
      <slot name="content" :header="header"></slot>
    </div>
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
    return {
      cart: computed(() => useCart())
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
.header-lite {
  @apply bg-gray-100 py-5;
  &__content {
    @apply container mx-auto flex flex-row items-start justify-between;
    .content {
      &__logo {
        @apply w-40;
      }
    }
  }
}
</style>
