<template>
  <div class="checkout-delivery">
    <div v-if="error" class="checkout-delivery__error">
      <slot name="error" :error="error">
        <div v-if="error" class="alert alert-error">
          {{ $t('error.generic') }}
        </div>
      </slot>
    </div>

    <template v-if="active">
      <div class="checkout-delivery__header">
        <slot name="header">
          <p>
            {{ $t('cart.delivery.method.intro') }}
          </p>
        </slot>
      </div>
      <div class="checkout-delivery__items">
        <slot name="items" :carriers="carriers" :selectCarrier="selectCarrier">
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
      </div>
      <slot v-if="loading && (carriers == null || carriers?.length == 0)">
        <div class="checkout-delivery__loading">
          <spinner></spinner>
        </div>
      </slot>
      <div class="checkout-delivery__total">
        <slot name="total" :error="error">
          <cart-total></cart-total>
          <div
            v-if="!selectedCarrier"
            class="flex items-center gap-2 font-bold"
          >
            <icon icon="ph:info" />
            {{ $t('cart.delivery.method.no-method') }}
          </div>
          <button
            type="button"
            class="btn-secondary btn-block btn"
            :class="{
              loading: loading
            }"
            @click="next"
            :disabled="!selectedCarrier || loading"
          >
            {{ $t('cart.delivery.method.continue') }}
          </button>
        </slot>
      </div>

      <div class="checkout-delivery__footer">
        <button type="button" class="btn-ghost btn" @click="back">
          <icon icon="material-symbols:chevron-left"></icon>
          {{ $t('cart.back') }}
        </button>
      </div>
    </template>
    <div v-else class="checkout-delivery__summary">
      <div class="method">
        <div class="method__icon">
          <icon icon="solar:box-line-duotone" />
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
import { DeliveryCarrier } from '~/models/DeliveryCarrier'

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

export default defineNuxtComponent({
  name: 'CheckoutDelivery',
  emits: ['next', 'back'],
  components: {
    'cart-total': CartTotal,
    spinner: Spinner
  },
  props: {
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
    async fetchCarriers() {
      const services = useShopinvaderServices()
      const cart = useCart()
      try {
        this.loading = true
        this.error = null
        this.carriers = []
        if (services?.deliveryCarriers) {
          const { carriers = [] } = await services.deliveryCarriers.getAll()

          this.carriers =
            carriers.map((carrier: DeliveryCarrier) => {
              const name =
                carrier.code?.charAt(0).toUpperCase() +
                carrier.code?.slice(1).toLowerCase()
              const component = importDeliveryComponent(name)
              return {
                component,
                carrier
              }
            }) || []
        }

        const selectedCarrier = cart?.value?.delivery?.method || null
        if (selectedCarrier) {
          this.selectedCarrier =
            this.carriers?.find((carrier) => carrier.id == selectedCarrier.id)
              ?.carrier || null
        }
      } catch (e) {
        console.log('error', e)
        this.error = e?.message || e
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
    async selectCarrier(carrier: DeliveryCarrier) {
      try {
        this.error = null
        this.selectedCarrier = carrier
        this.loading = true
        const services = useShopinvaderServices()
        const res = await services?.cart.setDeliveryCarrier(carrier.id)
      } catch (e) {
        this.selectedCarrier = null
        this.error = e?.message || e
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
  &__total {
    @apply col-span-3 flex flex-col justify-start gap-4 md:col-span-1;
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
