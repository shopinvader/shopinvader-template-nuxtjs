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
    <div v-if="cart.delivery?.method?.name" class="cart-total__shipping">
      <div class="label">
        {{ $t('cart.total.shipping') }}
      </div>
      <div class="value">
        {{ $filter.currency(cart.delivery.fees?.total) }}
      </div>
      <div v-if="cart.delivery.method?.name" class="mention">
        {{ $t('cart.delivery.method.title') }} {{ cart.delivery.method?.name }}
      </div>
    </div>
    <div class="cart-total__total">
      <div class="label">
        {{ $t('cart.total.title') }}
      </div>
      <div class="value">
        {{ $filter.currency(cart?.amount?.total) }}
      </div>
      <div class="mention">
        {{ $t('cart.total.tax') }} {{ $filter.currency(cart.amount.tax) }}
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
  & > div {
    @apply flex flex-wrap items-center justify-between pb-2;
    .label {
      @apply p-0;
    }
    .value {
    }
    .mention {
      @apply w-full flex-grow text-sm text-gray-600;
    }
  }

  &__total {
    @apply border-t pt-2 text-gray-900;
    .label {
      @apply p-0 text-lg font-bold text-gray-900;
    }
    .value {
      @apply text-lg text-gray-900;
    }
  }
}
</style>
