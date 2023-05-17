<template>
  <nuxt-link :to="localePath({ path: '/cart' })" class="cart-icon">
    <div class="button">
      <Icon icon="clarity:shopping-bag-line" class="button__icon" />
      <span class="button__label">
        {{ $t('cart.title') }}
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
    return {
      linesCount: computed((): number => {
        const services = useShopinvaderServices()
        if (!services?.cart) return 0
        const cart = services?.cart?.getCart()
        return cart.value?.lines?.length || 0
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
  }
  .cart-badge {
    @apply badge-secondary badge absolute right-1 top-1 text-xs font-semibold text-white shadow-md;
  }
}
</style>
