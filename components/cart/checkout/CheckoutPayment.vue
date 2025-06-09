<template>
  <div class="checkout-payment">
    <div class="checkout-payment__header">
      <!-- @slot Header content -->
      <slot name="header">
        <p>{{ $t('cart.payment.intro') }}</p>
      </slot>
      <div></div>
    </div>
    <div class="checkout-payment__items">
      <template v-if="!loading && paymentData">
        <slot name="items" :cart="cart" :payment-data="paymentData">
          <payment-method-list :payment-data="paymentData"></payment-method-list>
        </slot>
      </template>
      <template v-else-if="loading">
        <div class="checkout-payment__loading">
          <spinner></spinner>
          <div>
            {{ $t('cart.payment.loading') }}
          </div>
        </div>
      </template>
      <div v-if="error" class="checkout-payment__error">
        <span name="alert"></span>
        {{ error }}
      </div>
    </div>
    <div class="checkout-payment__total">
      <!-- @slot Total content-->
      <slot name="total">
        <cart-total></cart-total>
      </slot>
    </div>
    <div class="checkout-payment__footer">
      <button type="button" class="btn btn-ghost" @click="back">
        <icon name="left"></icon>
        {{ $t('cart.back') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { PaymentGeneric } from '#components'
import type { PaymentData, PaymentMethod } from '#models'

interface PaymentWithComponent extends PaymentMethod {
  component: any
  method: PaymentMethod
}

/**
 * Checkout Paiement Step.
 * This component is used in the Checkout funnel.
 * Use allow user to pick the payment method of the cart.
 */
export default defineNuxtComponent({
  name: 'CheckoutPayment',
  emits: {
    /** Emit to go to the next step */
    next: () => true,
    /** Emit to go back to the previous step */
    back: () => true
  },
  components: {
    'payment-generic': PaymentGeneric
  },
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    next() {
      this.$emit('next')
    },

    back() {
      this.$emit('back')
    }
  },

  async setup() {
    const paymentData = ref(null) as Ref<PaymentData | null>
    const cartService = useShopinvaderService('cart')
    const paymentService = useShopinvaderService('payment')
    const cart = cartService.getCart()
    const loading = ref(true)
    const methods = ref([] as PaymentWithComponent[])
    const error = ref(null)

    /* Fetch API to retrieve payment method available for the current */
    try {
      error.value = null
      methods.value = []
      if (!paymentService) {
        throw new Error('Payment service not available')
      }
      paymentData.value = await cartService.getPayable()
    } catch (e: any) {
      console.error(e)
      error.value = e
    } finally {
      loading.value = false
    }

    onMounted(async () => {})
    return {
      cart,
      paymentData,
      methods,
      error,
      loading
    }
  }
})
</script>
<style>
@reference "@/assets/css/main.css";

.checkout-payment {
  @apply grid grid-cols-1 gap-6 md:grid-cols-3;
  &__header {
    @apply col-span-full;
  }
  &__loading {
    @apply flex h-full flex-col items-center justify-center gap-4 text-xl;
    .icon {
      @apply relative;
      .icon__content {
        @apply relative flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-slate-300 text-xl text-primary;
      }
      .icon__effect {
        @apply absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-200 opacity-75;
      }
    }
  }
  &__items {
    @apply col-span-full flex flex-col justify-start gap-2 md:col-span-2;
  }
  &__error {
    @apply alert alert-error col-span-full md:col-span-1;
  }
  &__total {
    @apply col-span-full md:col-span-1;
  }
  &__footer {
    @apply col-span-full md:col-span-3;
  }
}
</style>
