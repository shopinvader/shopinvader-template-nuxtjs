<template>
  <div class="checkout-delivery">
    <template v-if="active">
      <div class="checkout-delivery__header">
        <!-- @slot Header content -->
        <slot name="header">
          <p>
            {{ $t('cart.delivery.method.intro') }}
          </p>
        </slot>
      </div>
      <div class="checkout-delivery__items">
        <div v-if="error" class="items__error">
          <!--
            @slot Checkout Delivery error content
            @binding {Error} error
          -->
          <slot name="error" :error="error">
            <div v-if="error" class="alert">
              <icon name="error" class="text-error" />
              {{ $t('error.generic') }}
            </div>
          </slot>
        </div>
        <div v-else-if="!loading && carriers.length == 0" class="checkout-delivery__empty">
          <div class="empty">
            <icon name="error" />
            {{ $t('cart.delivery.method.empty') }}
          </div>
        </div>
        <template v-else>
           <!--
            @slot Delivery carriers list
            @binding {Error} error
          -->
          <slot name="items" :carriers="carriers" :selectedCarrier="selectedCarrier" :select-carrier="selectCarrier">
            <component
              :is="component"
              v-for="{ carrier, component } of carriers"
              :key="carrier.id"
              :delivery-carrier="carrier"
              :selected="selectedCarrier?.id == carrier.id"
              @select="selectCarrier"
            >
            </component>
          </slot>
        </template>
      </div>
      <!-- @slot Fetch Loading content -->
      <slot v-if="loading && (carriers == null || carriers?.length == 0)">
        <div class="checkout-delivery__loading">
          <spinner></spinner>
        </div>
      </slot>
      <div class="checkout-delivery__total">
        <!-- @slot Cart Total content -->
        <slot name="total" :error="error">
          <cart-total>
            <template #footer>
              <div
                v-if="!loading && !selectedCarrier"
                class="no-delivery"
              >
                <icon name="info" />
                {{ $t('cart.delivery.method.no-method') }}
              </div>
              <button
                type="button"
                class="btn-secondary btn-block btn"
                @click="next"
                :disabled="!selectedCarrier || loading"
              >
                {{ $t('cart.delivery.method.continue') }}
                <icon name="right" />
              </button>
            </template>
          </cart-total>
        </slot>
      </div>
      <div class="checkout-delivery__footer">
        <button type="button" class="btn-ghost btn" @click="back">
          <icon name="left"></icon>
          {{ $t('cart.back') }}
        </button>
      </div>
    </template>
    <div v-else class="checkout-delivery__summary">
      <div class="method">
        <div class="method__icon">
          <icon name="carrier" />
        </div>
        <div class="method__title">
          {{ $t('cart.delivery.method.title') }} :
          {{ selectedCarrier?.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { DeliveryCarrier } from '#models'

import DeliveryGeneric from '~/components/delivery/DeliveryGeneric.vue'
import Spinner from '~/components/global/Spinner.vue'
import CartTotal from '../CartTotal.vue'
interface CarrierWithComponent extends DeliveryCarrier {
  component: any
  carrier: DeliveryCarrier
}
const importDeliveryComponent = (name: string) => {
  return defineAsyncComponent(() =>
    import(`../../delivery/Delivery${name}.vue`).catch(() => {
      return DeliveryGeneric
    })
  )
}

/**
 * Checkout delivery step.
 * This component is used in the Checkout funnel.
 * Use to select the shipping mode.
 */
export default defineNuxtComponent({
  name: 'CheckoutDelivery',
  emits: {
    /** Emit to go to the next step */
    next: () => true,
    /** Emit to go back to the previous step */
    back: () => true
  },
  components: {
    'cart-total': CartTotal,
    spinner: Spinner
  },
  props: {
    /**
     * Is the current step of the checkout process
     */
    active: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const i18n = useI18n()
    const selectedCarrier = ref(null as DeliveryCarrier | null)
    const carriers = ref([] as CarrierWithComponent[])
    const error = ref(null as string | null)
    const loading = ref(false)
    return {
      loading,
      i18n,
      error,
      carriers,
      selectedCarrier
    }
  },
  async mounted() {
    await this.fetchCarriers()
  },
  methods: {
    next() {
      this.$emit('next')
    },
    back() {
      this.$emit('back')
    },
    /**
     * Get the list of shipping mode available for the current cart.
     */
    async fetchCarriers() {
      const cartService = useShopinvaderService('cart')
      const cart = cartService.getCart()
      try {
        this.loading = true
        this.error = null
        this.carriers = []
        if (cart?.value) {
          const carriers = await cartService.getDeliveryCarrier() || []
          this.carriers =
            carriers.map((carrier: DeliveryCarrier) => {
              const name =
                carrier.code?.charAt(0).toUpperCase() +
                carrier.code?.slice(1).toLowerCase()
              const component = importDeliveryComponent(name)
              return {
                component,
                carrier
              } as CarrierWithComponent
            }) || []
        } else {
          throw new Error(this.i18n.t('error.generic'))
        }

        const selectedCarrier = cart?.value?.delivery?.method || null
        if (selectedCarrier) {
          this.selectedCarrier =
            this.carriers?.find(({carrier}) => carrier.id == selectedCarrier.id)
              ?.carrier || null
        }
      } catch (e: any) {
        this.error = e?.message || e
        console.error(e)
      } finally {
        this.loading = false
        if (this.carriers.length == 1) {
          await this.selectCarrier(this.carriers[0]?.carrier)
          this.$emit('next')
        } else if (this.carriers.length > 1 && !this.selectedCarrier) {
          await this.selectCarrier(this.carriers[0]?.carrier)
        }
      }
    },
    /**
     * Change the delivery carrier of the current cart
     * @param carrier
     */
    async selectCarrier(carrier: DeliveryCarrier) {
      try {
        this.error = null
        this.selectedCarrier = carrier
        this.loading = true
        const cartService = useShopinvaderService('cart')
        await cartService.setDeliveryCarrier(carrier.id)
      } catch (e: any) {
        this.selectedCarrier = null
        this.error = e?.message || e
        throw e
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
<style lang="scss">
.checkout-delivery {
  @apply grid grid-cols-3 gap-6;
  &__items {
    @apply col-span-3 flex flex-col justify-start gap-4 md:col-span-2;
  }
  &__empty {
    @apply col-span-3 md:col-span-2;
    .empty {
      @apply flex flex-col items-center gap-4 max-w-md mx-auto text-center;
      .icon {
        @apply text-error text-6xl;
      }
    }
  }
  &__total {
    @apply col-span-3 flex flex-col justify-start gap-4 md:col-span-1;
    .cart-total {
      &__footer {
        .no-delivery {
          @apply flex items-center gap-1 text-sm pb-3;
        }
      }
    }
  }
  &__header {
    @apply col-span-3 flex flex-col  justify-between;
  }
  &__footer {
    @apply col-span-3 flex justify-between;
  }
  &__error {
    @apply col-span-3;
  }
  &__loading {
    @apply col-span-3 flex h-full flex-col items-center justify-center gap-4 md:col-span-2;
  }
  &__summary {
    @apply col-span-3 md:col-span-2;
    .method {
      @apply flex w-full gap-2;
      &__icon {
        @apply text-4xl text-primary;
      }
      &__title {
        @apply flex items-center justify-start font-bold;
      }
    }
  }
}
</style>
