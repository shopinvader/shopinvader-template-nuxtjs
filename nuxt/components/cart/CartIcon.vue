<template>
  <nuxt-link :to="localePath({ path: '/cart' })" class="cart-icon">
    <div class="button">
      <Icon icon="clarity:shopping-bag-line" class="button__icon" />
      <span class="button__label">
        {{ $t('cart.title') }}
      </span>
    </div>
    <div v-if="hasCart" class="cart-badge">
      {{ linesCount }}
    </div>
  </nuxt-link>
</template>
<script lang="ts">
export default {
  name: 'CartIcon',
  components: {},
  async setup() {
    return {
      hasCart: computed((): boolean => {
        let linesCount: number = useCart()?.linesCount || 0
        return linesCount > 0
      }),
      linesCount: computed((): string => {
        let linesCount: boolean | string | number =
          useCart()?.linesCount || false
        if (linesCount > 100) {
          return '99+'
        } else {
          return linesCount + ''
        }
      })
    }
  }
}
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
