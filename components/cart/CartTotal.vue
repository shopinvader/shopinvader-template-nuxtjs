<template>
  <div class="cart-total">
    <div class="cart-total__title">
      {{ $t('cart.total.title') }}
    </div>
    <div class="cart-total__subtotal">
      <div class="label">
        {{ $t('cart.total.subtotal') }}
      </div>
      <div class="value">
        {{ $filter.currency(cart?.linesAmount?.total) }}
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
  </div>
</template>
<script lang="ts">
export default {
  name: 'CartTotal',
  computed: {
    cart() {
      return useCart()
    }
  }
}
</script>
<style lang="scss">
.cart-total {
  @apply bg-gray-100 p-4;
  &__title {
    @apply text-center text-xl;
  }
  &__subtotal {
    @apply flex justify-between;
    .label {
      @apply text-gray-500;
    }
    .value {
      @apply text-gray-700;
    }
  }
  &__total {
    @apply flex justify-between;
    .label {
      @apply text-lg;
    }
    .value {
      @apply text-lg;
    }
  }
}
</style>
