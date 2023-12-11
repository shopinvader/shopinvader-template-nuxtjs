<template>
  <nuxt-link :to="localePath({ path: '/cart' })" class="cart-icon">
    <div class="button">
      <icon name="cart" class="button__icon" />
      <span class="button__label">
        {{ $t('cart.title') }}
      </span>
      <span class="button-mobile__label">
        {{ $t('navbar.cart') }}
      </span>
    </div>
    <div v-if="linesCount > 0" class="cart-badge">
      <template v-if="linesCount < 99">
        {{ linesCount }}
      </template>
      <template v-else> +99 </template>
    </div>
  </nuxt-link>
</template>
<script lang="ts">
export default defineNuxtComponent({
  name: 'CartIcon',
  components: {},
  async setup() {
    const cartService = useShopinvaderService('cart')
    const cart = cartService?.getCart()
    return {
      linesCount: computed((): string => {
        if (!cartService) return 0

        let linesCount: boolean | string | number =
          cart.value?.lines?.length || 0
        if (linesCount > 100) {
          return '99+'
        } else {
          return linesCount + ''
        }
      })
    }
  }
})
</script>
<style lang="scss">
.cart-icon {
  @apply relative flex  px-2;
  .button {
    @apply btn-ghost btn flex flex-col flex-nowrap  max-md:px-1;
    &__icon {
      @apply text-2xl;
    }
    &__label {
      @apply absolute -bottom-5 text-xs font-normal capitalize leading-3 max-lg:hidden;
    }
    &-mobile__label {
      @apply block w-full text-center text-xs font-normal normal-case transition-all duration-100 ease-in-out md:hidden;
    }
  }
  .cart-badge {
    @apply badge-secondary badge absolute right-1 top-1 text-xs font-semibold text-white shadow-md;
  }
}
</style>
