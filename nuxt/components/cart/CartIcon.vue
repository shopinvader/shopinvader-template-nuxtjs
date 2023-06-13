<template>
  <nuxt-link :to="localePath({ path: '/cart' })" class="cart-icon">
    <div class="button">
      <Icon icon="clarity:shopping-bag-line" class="button__icon" />
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
    const localePath = useLocalePath()
    
    return {
      localePath,
      hasCart: computed((): boolean => {
        let linesCount: number = useCart()?.linesCount || 0
        return linesCount > 0
      }),
      linesCount: computed((): string => {
        const services = useShopinvaderServices()
        if (!services?.cart) return 0
        const cart = services?.cart?.getCart()?.value
        let linesCount: boolean | string | number = cart.lines?.length || 0
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
      @apply md:hidden normal-case text-xs w-full text-center block transition-all duration-100 ease-in-out font-normal;
    }
  }
  .cart-badge {
    @apply badge-secondary badge absolute right-1 top-1 text-xs font-semibold text-white shadow-md;
  }
}
</style>
