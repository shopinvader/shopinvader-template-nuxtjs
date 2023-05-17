<template>
  <nuxt-layout name="checkout">
    <template #header>
      <h1>{{ $t('cart.payment.title') }}</h1>
    </template>
    <template v-if="cart" #body>
      <div class="cart-payment">
        <div class="cart-payment__items"></div>
        <div class="cart-payment__total">
          <cart-total class="">
            <template #footer>
              <nuxt-link
                class="btn-primary btn mt-6 w-full"
                :to="{ path: '/cart/address' }"
              >
                {{ $t('cart.checkout') }}
              </nuxt-link>
            </template>
          </cart-total>
        </div>
      </div>
      <product-history></product-history>
    </template>
  </nuxt-layout>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: false
})
const cart = useCart()
</script>
<style lang="scss">
.cart-payment {
  @apply flex gap-4 border pb-10;
  &__items {
    @apply w-full lg:w-2/3;
  }
  &__total {
    @apply w-full lg:w-1/3;
  }
}
</style>
