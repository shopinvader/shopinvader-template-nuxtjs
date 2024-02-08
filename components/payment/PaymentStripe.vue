<template>
  <payment-generic
    class="payment-stripe"
    :method="method"
    :paymentData="paymentData"
    @transaction="setTransaction"
  >
    <template #name="{ method }">
      <icon name="logos:stripe"  class="icon"/>
      {{ method.name }}
    </template>
  </payment-generic>

</template>
<script lang="ts">
import type { PaymentMethod, PaymentData, PaymentTransaction } from '#models';
import {loadStripe} from '@stripe/stripe-js';
export default {
  props: {
    method: {
      type: Object as PropType<PaymentMethod>,
      required: true
    },
    paymentData: {
      type: Object as PropType<PaymentData>,
      required: true
    }
  },
  async setup() {
    const localePath = useLocalePath()
    const checkoutRef = ref(null)
    const error = ref(null) as Ref<string | null>
    const successUrl = `${window.location.origin}${localePath({ path:`/checkout/validated`})}`
    const cancelUrl = `${window.location.origin}${localePath({ path:`/checkout`})}`
    const setTransaction = async (transaction:PaymentTransaction) => {
      if(loadStripe && transaction?.publishableKey && transaction?.sessionId) {
        const stripe = await loadStripe(transaction.publishableKey)
        if(stripe) {
          const res = await stripe.redirectToCheckout({
            sessionId: transaction.sessionId
          })
          if(res?.error) {
            error.value = res?.error?.message
          }
        }
      }
    }

    return {
      successUrl,
      cancelUrl,
      checkoutRef,
      error,
      setTransaction
    }
  },
  methods: {

  }
}
</script>
<style lang="scss">
  .payment-stripe {
    .payment-generic {
      &__name {
        @apply flex gap-2 items-center;
        .icon {
          @apply text-4xl text-secondary-500;
        }
      }
      &__action {
        @apply flex justify-end;
        .action {
          &__submit {
            @apply btn btn-secondary btn-sm;
          }
        }
      }
    }
  }
</style>
