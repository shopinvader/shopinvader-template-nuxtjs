<template>
  <div class="checkout-payment">
    <div class="checkout-payment__header">
      <slot name="header">
        <p>
          {{ $t('cart.payment.intro') }}
        </p>
      </slot>
    </div>
    <div class="checkout-payment__items">
      <slot name="items" :cart="cart">
        <PaymentStripe />
      </slot>
    </div>
    <div class="checkout-payment__footer">
      <button type="button" class="btn-ghost btn" @click="back">
        {{ $t('cart.back') }}
      </button>
      <button type="button" class="btn-secondary btn" @click="next">
        {{ $t('cart.payment.submit') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import PaymentStripe from '~/components/payment/Stripe.vue'
export default defineNuxtComponent({
  name: 'CheckoutPayment',
  components: {
    'payment-stripe': PaymentStripe
  },
  methods: {
    next() {
      this.$emit('next')
    },
    back() {
      this.$emit('back')
    }
  },
  setup() {
    const cart = useCart()
    return {
      cart
    }
  }
})
</script>
<style lang="scss">
.checkout-payment {
  @apply flex flex-col gap-6;
  &__items {
    @apply flex justify-between;
  }
  &__footer {
    @apply flex justify-between;
  }
}
</style>
