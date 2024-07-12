<template>
  <nuxt-link :to="localePath('/cart')" class="cart-icon">
    <div class="button">
      <icon name="cart" class="button__icon" />
      <span class="button__label">
        {{ $t('cart.title') }}
      </span>
      <span class="button-mobile__label">
        {{ $t('navbar.cart') }}
      </span>
    </div>
    <client-only>
      <div v-if="linesCount > 0" class="cart-badge">
        <template v-if="linesCount < 99">
          {{ linesCount }}
        </template>
        <template v-else> +99 </template>
      </div>
    </client-only>
  </nuxt-link>
</template>
<script lang="ts" setup>
const cartService = useShopinvaderService('cart')
const cart = cartService?.getCart()
const linesCount = computed((): number => {
  return cart?.value?.lines?.length || 0
})
</script>
<style lang="scss">
.cart-icon {
  @apply relative flex px-2 pb-5;
  .button {
    @apply btn btn-ghost flex flex-col flex-nowrap max-md:px-1 relative;
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
    @apply badge badge-secondary absolute right-1 top-1 text-xs font-semibold text-white shadow-md;
  }
}
</style>
