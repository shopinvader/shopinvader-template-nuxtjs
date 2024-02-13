<template>
  <code>
    <pre>
      {{ cart?.reward }}
    </pre>
  </code>
  <div v-if="cart" class="cart-total">
    <div class="cart-total__title">
      <!-- @slot Title display in the cart total -->
      <slot name="header">
        {{ $t('cart.total.title') }}
      </slot>
    </div>
    <div class="cart-total__header">
      <!-- @slot Header display after the title -->
      <slot name="header"></slot>
    </div>
    <!-- @slot Body display after the cart total block -->
    <slot name="body">
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
          <icon name="carrier" />
          {{ cart.delivery.method?.name }}
        </div>
      </div>
      <div v-if="cart?.discount?.value != 0" class="cart-total__discount">
        <div class="label">
          {{ $t('cart.discount.title') }}
        </div>
        <div class="value">
          {{ $filter.currency(cart?.discount?.taxIncluded) }}
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
    </slot>
    <div class="cart-total__footer">
      <!-- @slot Footer display in the cart total -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
  /**
   * Display the cart's total
   * This component is used in the component Cart and in sereral checkout steps.
   * This component retrieve the cart from the store.
   */
  const cartService = useShopinvaderService('cart')
  const cart = cartService.getCart()
</script>
<style lang="scss">
.cart-total {
  @apply card card-body bg-gray-100;
  &__title {
    @apply font-heading text-xl;
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
  &__discount {
    @apply border-t pt-2 text-gray-900;
    .label {
      @apply p-0  text-accent-600;
    }
    .value {
      @apply text-lg  text-accent-600;
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
