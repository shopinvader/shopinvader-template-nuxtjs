<template>
  <div v-if="cart" class="cart-total">
    <div class="cart-total__title">
      {{ $t('cart.total.title') }}
    </div>
    <div class="cart-total__header">
      <slot name="header"></slot>
    </div>
    <div class="cart-total__subtotal">
      <div class="label">
        {{ $t('cart.total.subtotal') }}
      </div>
      <div class="value">
        {{ $filter.currency(cart?.linesAmount?.untaxed) }}
      </div>
    </div>
    <div class="cart-total__total">
      <div class="label">
        {{ $t('cart.total.title') }}
      </div>
      <div class="value">
        {{ $filter.currency(cart?.amount?.total) }}
      </div>
    </div>
    <div class="cart-total__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'CartTotal',
  computed: {
    cart() {
      return useCart().value
    }
  }
}
</script>
<style lang="scss">
.cart-total {
  @apply bg-gray-100 px-6 py-10;
  &__title {
    @apply heading text-xl;
  }
  &__subtotal {
    @apply flex items-center justify-between;
    .label {
      @apply text-gray-500;
    }
    .value {
      @apply text-gray-700;
    }
  }
  &__total {
    @apply flex items-center justify-between font-bold;
    .label {
      @apply text-lg;
    }
    .value {
      @apply text-lg;
    }
  }
}
</style>
