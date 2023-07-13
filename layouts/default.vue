<template>
  <div id="app">
    <div id="header-target"></div>
    <slot name="header">
      <header-main></header-main>
    </slot>
    <main>
      <slot name="body"> </slot>
      <slot></slot>
      <aside-drawer :open="cartDrowerOpened" @close="closeDrawer">
        <template #header>
          <div class="text-2xl">
            {{ $t('cart.title') }}
          </div>
        </template>
        <template #content>
          <cart> </cart>
        </template>
      </aside-drawer>
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
import AsideDrawer from '~/components/global/AsideDrawer.vue'
import Cart from '~/components/cart/Cart.vue'
import { CartLine } from '~~/models'
export default defineNuxtComponent({
  name: 'Default',
  components: {
    'header-main': HeaderMain,
    'footer-main': FooterMain,
    'notifications-vue': Notifications,
    'navbar-bottom': NavbarBottomVue,
    'aside-drawer': AsideDrawer,
    'cart': Cart
  },
  data() {
    return {
      cartDrowerOpened: false as boolean
    }
  },
  computed: {
    lines(): CartLine[] {
      const cartService = useShopinvaderService('cart')
      const cart = cartService.getCart()
      return cart?.value?.lines as CartLine[]
    }
  },
  watch: {
    lines(lines, oldLines): void {
      if (lines.length > oldLines.length) {
        this.cartDrowerOpened = true
      }
    }
  },
  methods: {
    closeDrawer(): void {
      this.cartDrowerOpened = false
    }
  }
})
</script>
<style lang="scss">
main {
  @apply container mx-auto flex-grow;
}

#app {
  @apply flex min-h-screen flex-col;

  .aside-drawer {
   .side__content {
    @apply h-full;
   }
    &__side {
      @apply absolute right-0 left-auto h-screen w-10/12 max-w-screen-sm overflow-y-auto bg-white shadow-xl;
    }
    .side__footer {
      @apply hidden;
    }
    .cart {
      @apply flex flex-col place-content-between justify-between;
    }

  }
}
</style>
