<template>
  <div
    v-if="cart && user"
    class="checkout-address"
    :class="{ 'checkout-address--active': active }"
  >

    <div v-if="error" class="alert alert-error mb-6 flex gap-1">
      <icon name="error" class="text-xl"></icon>
      <span>{{ error }}</span>
    </div>
    <div class="checkout-address__items">
      <cart-address-delivery class="address" :editable="active"></cart-address-delivery>
      <cart-address-invoicing class="address" :editable="active"></cart-address-invoicing>
    </div>
    <div v-if="active" class="checkout-address__submit">
      <button
        class="btn-secondary btn px-10"
        :class="{ loading: loading }"
        type="submit"
        @click="submit"
        :disabled="loading"
      >
        {{ $t('cart.address.continue') }}***
        <icon name="right" class="text-lg"></icon>
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { CartAddressDelivery, CartAddressInvoicing, AddressCard } from '#components'
import { Address } from '#models'

/**
 * Checkout Address step.
 * This component is used in the Checkout funnel.
 * Use to select cart delivery and invoice addresses.
 */
export default defineNuxtComponent({
  name: 'cart-address',
  emits: {
    /** Emit to go to the next step */
    next: () => true,
    /** Emit to go back to the previous step */
    back: () => true
  },
  components: {
    'address-card': AddressCard,
    'cart-address-delivery': CartAddressDelivery,
    'cart-address-invoicing': CartAddressInvoicing
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
  computed: {
    deliveryAddress() {
      const cartService = useShopinvaderService('cart')
      const cart = cartService.getCart()
      return cart.value?.delivery?.address
    },
  },
  async setup(props, { emit }) {
    const i18n = useI18n()
    const auth = useShopinvaderService('auth')
    const cartService = useShopinvaderService('cart')
    const cart = cartService.getCart()
    const loading = ref(false)
    const error = ref(null as string | null)

    /** Check if the customer is logged */
    const user = auth?.getUser()

    const submit = () => {
      try {
        loading.value = true
        if (!cart.value) throw new Error('Cart not found')
        const { delivery, invoicing } = cart.value
        if (!delivery?.address?.id || !invoicing?.address?.id) {
          throw new Error(i18n.t('cart.address.no-address'))
        }
        emit('next')
      } catch (e: any) {
        error.value = e?.message || e
        loading.value = false
      } finally {
        loading.value = false
      }
    }

    return {
      error,
      cart,
      loading,
      submit,
      user
    }
  }
})
</script>
<style lang="scss">
.checkout-address {
  @apply flex flex-col gap-6;
  &__items {
    @apply flex w-full flex-row flex-wrap gap-6;
    .address {
      @apply flex-grow rounded-lg bg-slate-50 p-4 text-slate-900 shadow-none;
      .title {
        @apply m-0 flex items-center gap-4 text-xl font-bold uppercase leading-none text-inherit;
      }
      .subtitle {
        @apply ml-4 pt-3;
      }
    }
  }
  &--active {
    .checkout-address__items {
      .address {
        @apply card shadow-lg rounded-md;
      }
    }
  }

  &__submit {
    @apply flex w-full flex-grow justify-end gap-6 py-4;
  }
}

</style>
