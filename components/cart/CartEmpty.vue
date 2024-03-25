<template>
  <div class="cart-empty">
    <!-- @slot Message display when the cart is empty   -->
    <slot v-if="cart?.loaded" name="empty">
      <icon name="cart" class="text-6xl text-gray-300"></icon>
      <div class="cart-empty__title">
        {{ $t('cart.empty') }}
      </div>
      <nuxt-link :to="localePath({ path: '/' })" class="btn-primary btn">
        {{ $t('cart.continue') }}
      </nuxt-link>
    </slot>
    <spinner-vue v-else></spinner-vue>
  </div>
</template>
<script lang="ts">
import Spinner from '~/components/global/Spinner.vue'
import { Cart } from '~/models'
/**
 * Message display when the cart is empty.
 * This component retrieve the cart from the store.
 */
export default defineNuxtComponent({
  components: {
    spinner: Spinner
  },
  setup() {
    const localePath = useLocalePath()
    const cartService = useShopinvaderService('cart')
    const cart = cartService.getCart()
    return {
      cart,
      localePath
    }
  },
  computed: {
    lineCount(): number {
      return this.cart?.lines.length || 0
    }
  }
})
</script>
<style lang="scss">
.cart-empty {
  @apply flex flex-col items-center justify-center py-4;
  &__title {
    @apply pb-10 text-3xl;
  }
}
</style>
