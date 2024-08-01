<template>
  <header class="header-lite">
    <div class="header-lite__content">
      <slot name="logo">
        <a :href="localePath({ path: '/' })">
          <logo></logo>
        </a>
      </slot>
      <slot name="content"></slot>
    </div>
  </header>
</template>
<script lang="ts">
import Logo from '~/components/global/Logo.vue'

export default defineNuxtComponent({
  name: 'global-header',
  fetchKey: 'header',
  components: {
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
      cart,
      localePath
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
