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
          <div
            v-for="carrier in carriers"
            :key="carrier.id"
            class="method"
            :class="{
              'method--selected': selectedCarrier?.id == carrier?.id
            }"
            @click="selectCarrier(carrier)"
          >
            <div class="method__icon">
              <icon icon="solar:box-line-duotone" />
            </div>
            <div class="method__body">
              <div class="body__title">
                {{ carrier.name }}
              </div>
              <div class="body__description">
                {{ carrier.description }}
              </div>
            </div>
            <div class="method__price">
              {{ $filter.currency(carrier.price) }}
            </div>
          </div>
        </slot>
      </div>
      <slot v-if="loading && carriers == null">
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
import Spinner from '~/components/global/Spinner.vue'
import CartTotal from '../CartTotal.vue'
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
    const carriers = ref(null as DeliveryCarrier[] | null)
    const error = ref(null as string | null)
    const loading = ref(false)

    /** Set page title */
    useHead({
      title: i18n.t('cart.delivery.method.title')
    })

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
        this.carriers = null
        if (services?.deliveryCarriers) {
          const results = await services.deliveryCarriers.getAll()
          this.carriers = results.carriers || []
        }
        const selectedCarrier = cart?.value?.delivery?.method || null
        if (selectedCarrier) {
          this.selectedCarrier =
            this.carriers?.find(
              (carrier) => carrier.id == selectedCarrier.id
            ) || null
        }
      } catch (e) {
        this.error = e?.message || e
      } finally {
        this.loading = false
      }
    },
    async selectCarrier(carrier: DeliveryCarrier) {
      try {
        this.selectedCarrier = carrier
        this.loading = true
        const services = useShopinvaderServices()
        const res = await services?.cart.setDeliveryCarrier(carrier.id)
        console.log(res)
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
    .method {
      @apply flex w-full cursor-pointer gap-2 rounded border p-4 transition-all duration-300 ease-in-out hover:border-primary hover:shadow-md;
      &--selected {
        @apply border-2 border-primary shadow-lg;
      }
      &__icon {
        @apply text-5xl text-primary;
      }
      &__body {
        @apply w-full flex-grow;
        .body {
          &__title {
            @apply flex items-center justify-start font-bold;
          }
          &__description {
            @apply text-gray-500;
          }
        }
      }
      &__price {
        @apply flex  justify-end font-bold text-primary;
      }
    }
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
