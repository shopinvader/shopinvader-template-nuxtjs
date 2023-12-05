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
      <template v-if="!loading">
        <!-- @slot Payment modes list -->
        <slot name="items" :cart="cart">
          <component
            :is="component"
            v-for="{ mode, component } of modes"
            :key="mode.id"
            class="item"
            :payment-mode="mode"
            @success="next"
            @error="error = $event"
          />
        </slot>
      </template>
      <template v-else>
        <div class="checkout-payment__loading">
          <div class="icon">
            <span class="icon__effect"></span>
            <span class="icon__content">
              <icon name="svg-spinners:bars-scale-middle" />
            </span>
          </div>
          <div>
            {{ $t('cart.payment.loading') }}
          </div>
        </div>
      </template>
    </div>
    <div class="checkout-payment__total">
      <!-- @slot Total content-->
      <slot name="total">
        <cart-total></cart-total>
      </slot>
    </div>
    <div class="checkout-payment__footer">
      <button type="button" class="btn-ghost btn" @click="back">
        <icon name="left"></icon>
        {{ $t('cart.back') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import PaymentGeneric from '~/components/payment/PaymentGeneric.vue'
import { PaymentMode } from '#models'

interface PaymentWithComponent extends PaymentMode {
  component: any
  mode: PaymentMode
}

const importPaymentComponent = (name: string) => {
  return defineAsyncComponent(() =>
    import(`../../payment/Payment${name}.vue`).catch(() => {
      return PaymentGeneric
    })
  )
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
  data() {
    return {
      loading: false,
      modes: [] as PaymentWithComponent[],
      error: null
    }
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
    },
    async fetchPaymentModes() {
      const paymentModes = useShopinvaderService('paymentModes')
      try {
        this.loading = true
        this.error = null
        this.modes = []
        if (paymentModes) {
          const { modes = [] } = await paymentModes.getAll()
          this.modes =
            modes.map((mode: PaymentMode) => {
              const name =
                mode.code?.charAt(0).toUpperCase() +
                mode.code?.slice(1).toLowerCase()
              const component = importPaymentComponent(name)
              return {
                component,
                mode
              } as PaymentWithComponent
            }) || []
        }
      } catch (e: any) {
        this.error = e?.message || e
      } finally {
        this.loading = false
      }
    }
  },
  async mounted() {
    await this.fetchPaymentModes()
  },
  setup() {
    const cartService = useShopinvaderService('cart')
    const cart = cartService.getCart()
    return {
      cart
    }
  }
})
</script>
<style lang="scss">
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
    @apply col-span-2 flex flex-col justify-start gap-2;
    .item {
      @apply border-t;
    }
  }
  &__total {
    @apply col-span-1;
  }
  &__footer {
    @apply col-span-3;
  }
}
</style>
