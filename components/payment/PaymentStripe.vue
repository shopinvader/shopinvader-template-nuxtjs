<template>
  <div class="payment-stripe">
    <div v-if="error" class="payment-stripe__error">
      {{ error }}
    </div>
    <div class="payment-stripe__content">
      <Spinner />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PaymentTransaction } from '#models'
import { loadStripe } from '@stripe/stripe-js'
const props = defineProps({
  transaction: {
    type: Object as PropType<PaymentTransaction>,
    required: true
  }
})
const error = ref(null) as Ref<string | null>
onMounted(async () => {
  const { transaction } = props
  if (loadStripe && transaction?.publishableKey && transaction?.sessionId) {
    const stripe = await loadStripe(transaction.publishableKey)
    if (stripe) {
      const res = await stripe.redirectToCheckout({
        sessionId: transaction.sessionId
      })
      if (res?.error) {
        error.value = res?.error?.message || 'An error occured'
      }
    }
  }
})
</script>
<style>
@reference "@/assets/css/main.css";

.payment-stripe {
  @apply flex min-h-20 flex-col items-center;
  &__error {
    @apply alert alert-error;
  }
  &__content {
    @apply flex items-center justify-center;
  }
}
</style>
