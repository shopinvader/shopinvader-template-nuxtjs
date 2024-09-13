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
          <slot
            name="items"
            :carriers="carriers"
            :selectedCarrier="selectedCarrier"
            :select-carrier="selectCarrier"
            :loading="loading"
          >
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
        <slot
          name="total"
          :error="error"
          :loading="loading"
          :carriers="carriers"
          :selectedCarrier="selectedCarrier"
        >
          <cart-total>
            <template #footer>
              <template v-if="!loading">
                <div v-if="!hasValidCarrier" class="no-delivery">
                  <icon name="info" />
                  <span v-if="selectedCarrier?.withDropoffSite && !deliveryAddress?.isDropoffSite">
                    {{ $t('cart.delivery.method.no-dropoff') }}
                  </span>
                  <span v-else>
                    {{ $t('cart.delivery.method.no-method') }}
                  </span>
                </div>
              </template>
              <button
                type="button"
                class="btn btn-secondary btn-block"
                @click="next"
                :disabled="!hasValidCarrier || loading"
              >
                {{ $t('cart.delivery.method.continue') }}
                <icon name="right" />
              </button>
            </template>
          </cart-total>
        </slot>
      </div>
      <div class="checkout-delivery__footer">
        <button type="button" class="btn btn-ghost" @click="back">
          <icon name="left"></icon>
          {{ $t('cart.back') }}
        </button>
      </div>
    </template>
    <div v-else class="checkout-delivery__summary">
      <slot name="summary" :selected-carrier="selectedCarrier">
        <div class="method">
          <div class="method__icon">
            <icon name="carrier" />
          </div>
          <div class="method__title">
            {{ $t('cart.delivery.method.title') }} :
            <span class="title__name">
              {{ selectedCarrier?.name }}
            </span>
          </div>
          <div v-if="deliveryAddress?.isDropoffSite" class="method__dropoff">
            {{ deliveryAddress }}
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
import type { DeliveryCarrier } from '#models'
import { DeliveryGeneric, Spinner } from '#components'
import CartTotal from '../CartTotal.vue'
interface CarrierWithComponent extends DeliveryCarrier {
  component: any
  carrier: DeliveryCarrier
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
    },
    deliveryComponents: {
      type: Object as PropType<{ [key: string]: Component }>,
      default: () => ({})
    }
  },
  setup() {
    const i18n = useI18n()
    const cartService = useShopinvaderService('cart')
    const cart = cartService.getCart()
    const selectedCarrier = ref(null as DeliveryCarrier | null)
    const carriers = ref([] as CarrierWithComponent[])
    const error = ref(null as string | null)
    const loading = ref(false)
    const hasValidCarrier = computed(() => {
      if (selectedCarrier?.value) {
        // Check if the selected carrier is a pickup carrier
        if (selectedCarrier?.value?.withDropoffSite) {
          return cart?.value?.delivery?.address?.isDropoffSite
        }
        return true
      }
      return false
    })
    const deliveryAddress = computed(() => {
      return cart?.value?.delivery?.address
    })

    return {
      loading,
      i18n,
      error,
      carriers,
      selectedCarrier,
      deliveryAddress,
      hasValidCarrier
    }
  },
  async mounted() {
    await this.fetchCarriers()
  },
  methods: {
    next() {
      if (this.hasValidCarrier) {
        this.$emit('next')
      }
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
          const carriers = (await cartService.getDeliveryCarrier()) || []
          this.carriers =
            carriers.map((carrier: DeliveryCarrier) => {
              const component = this.deliveryComponents?.[carrier?.code] || DeliveryGeneric
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
            this.carriers?.find(({ carrier }) => carrier.id == selectedCarrier.id)?.carrier || null
        }
      } catch (e: any) {
        this.error = e?.message || e
        console.error(e)
      } finally {
        this.loading = false
        if (this.carriers.length == 1) {
          const { carrier = null } = this.carriers[0]
          if (carrier) {
            await this.selectCarrier(carrier)
            this.next()
          }
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
        if (carrier?.id == this.selectedCarrier?.id) {
          return
        }
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
      @apply mx-auto flex max-w-md flex-col items-center gap-4 text-center;
      .icon {
        @apply text-6xl text-error;
      }
    }
  }
  &__total {
    @apply col-span-3 flex flex-col justify-start gap-4 md:col-span-1;
    .cart-total {
      &__footer {
        .no-delivery {
          @apply flex items-center gap-1 pb-3 text-sm;
        }
      }
    }
  }
  &__header {
    @apply col-span-3 flex flex-col justify-between;
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
      @apply grid w-full gap-2;
      grid-template: auto 2fr;
      &__icon {
        @apply col-auto col-start-1 row-span-2 row-start-1 text-5xl text-primary;
      }
      &__title {
        @apply col-span-2;
        .title {
          &__name {
            @apply font-bold;
          }
        }
      }
      &__dropoff {
        @apply col-span-2 row-start-2 text-xs font-normal;
      }
    }
  }
}
</style>
