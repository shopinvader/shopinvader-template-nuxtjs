<template>
  <div class="cart-empty">
    <!-- @slot Message display when the cart is empty   -->
    <slot v-if="cart?.loaded" name="empty">
      <icon name="cart" class="text-6xl text-gray-300"></icon>
      <div class="cart-empty__title">
        {{ $t('cart.empty') }}
      </div>
      <nuxt-link :to="localePath('/')" class="btn btn-primary">
        {{ $t('cart.continue') }}
      </nuxt-link>
    </slot>
    <spinner v-else></spinner>
  </div>
</template>
<script lang="ts">
/**
 * Message display when the cart is empty.
 * This component retrieve the cart from the store.
 */
export default defineNuxtComponent({
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
