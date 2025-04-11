<template>
  <div
    v-if="cart && user && !loadingStep"
    class="checkout-address"
    :class="{ 'checkout-address--active': active }"
  >
    <div v-if="error" class="alert alert-error mb-6 flex gap-1">
      <icon name="error" class="text-xl"></icon>
      <span>{{ error }}</span>
    </div>
    <template v-if="editAddress && active">
      <slot name="create-address" :cart="cart">
        <div class="checkout-address__form">
          <h2>{{ t('cart.address.shipping.title') }}</h2>
          <address-form
            v-if="editAddress"
            @submit="saveAddress"
            class="address"
            :address="editAddress"
          ></address-form>
          <button class="btn btn-link" @click="editAddress = null">
            {{ t('cart.back') }}
          </button>
        </div>
      </slot>
    </template>
    <template v-else>
      <div class="checkout-address__items">
        <cart-address-delivery class="address" :editable="active"> </cart-address-delivery>
        <cart-address-invoicing
          v-if="!sameAddresses"
          class="address"
          :editable="active"
        ></cart-address-invoicing>
      </div>
      <div v-if="active" class="checkout-address__submit">
        <button
          class="btn btn-secondary px-10"
          :class="{ loading: loading }"
          type="submit"
          @click="submit"
          :disabled="loading"
        >
          {{ t('cart.address.continue') }}
          <icon name="right" class="text-lg"></icon>
        </button>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { Address } from '#models'

/**
 * Checkout Address step.
 * This component is used in the Checkout funnel.
 * Use to select cart delivery and invoice addresses.
 */
const emit = defineEmits({
  /** Emit to go to the next step */
  next: () => true,
  /** Emit to go back to the previous step */
  back: () => true
})
const props = defineProps({
  /**
   * Is the current step of the checkout process
   */
  active: {
    type: Boolean,
    required: true
  }
})

const { t } = useI18n()
const auth = useShopinvaderService('auth')
const cartService = useShopinvaderService('cart')
const addressService = useShopinvaderService('addresses')
const editAddress = ref(null as Address | null)
const cart = cartService.getCart()
const sameAddresses = computed(() => {
  return cart.value?.hasSameAddress()
})
const loading = ref(false)
const loadingStep = ref(true)
const error = ref(null as string | null)

onMounted(async () => {
  try {
    loadingStep.value = true
    if (!cart.value || !addressService) return

    const addresses = await addressService.search('')
    const deliveryAddressId = cart.value?.delivery?.address?.id
    const invoicingAddressId = cart.value?.invoicing?.address?.id
    const deliveryAddress =
      addresses.find((a: Address) => a.id == deliveryAddressId) || addresses[0]
    const invoicingAddress =
      addresses.find((a: Address) => a.id == invoicingAddressId) ||
      addresses.find((a: Address) => a.type == 'invoicing')

    if (!invoicingAddress?.isValidAddress()) {
      editAddress.value = deliveryAddress
    } else if (!deliveryAddress?.isValidAddress()) {
      editAddress.value = deliveryAddress
    } else {
      await cartService.setAddresses(deliveryAddress, invoicingAddress)
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingStep.value = false
  }
})

const submit = () => {
  try {
    loading.value = true
    if (!cart.value || !cart.value?.hasValidAddresses()) {
      setTimeout(() => {
        error.value = t('cart.address.warning')
        loading.value = false
      }, 1000)
    } else {
      emit('next')
    }
  } catch (e: any) {
    error.value = e?.message || e
    loading.value = false
  } finally {
    loading.value = false
  }
}

watch(
  () => props.active,
  async (active, oldValue) => {
    if (active !== oldValue && active) {
      if (!cart.value || !addressService) return
      if (!cart.value?.hasValidAddresses()) {
        const addresses = await addressService.search('')
        editAddress.value =
          addresses.find((a: Address) => a.id == deliveryAddress.value?.id) || addresses[0]
      } else {
        editAddress.value = null
      }
    }
  }
)
/** Check if the customer is logged */
const user = auth?.getUser()
const saveAddress = async (address: Address) => {
  const addressService = useShopinvaderService('addresses')
  if (addressService && address) {
    try {
      loading.value = true
      if (address.id) {
        editAddress.value = address = await addressService.update(address)
      } else {
        editAddress.value = address = await addressService.create(address)
      }
      await setCartAddress(address)
      if (cart.value?.hasValidAddresses()) {
        emit('next')
      }
    } catch (e) {
      console.error(e)
      editAddress.value = null
      setTimeout(() => {
        editAddress.value = address
      }, 100)
      error.value = t('account.address.save.error')
    } finally {
      loading.value = false
    }
  }
}

const setCartAddress = async (address: Address) => {
  await cartService.setAddress('delivery', address)
  if (!cart.value?.invoicing?.address?.isValidAddress()) {
    await cartService.setAddress('invoicing', address)
  }
}
</script>
<style lang="scss">
.checkout-address {
  @apply flex flex-col gap-6;
  &__form {
    @apply card card-body mx-auto w-full max-w-2xl bg-white;
  }
  &__items {
    @apply grid grid-cols-1 gap-6 lg:grid-cols-2;

    .address-card {
      @apply bg-white shadow-none;
      &__header {
        .title {
          @apply m-0 flex items-center gap-3 text-xl font-bold uppercase leading-none text-inherit;
        }
        .subtitle {
          @apply ml-8 pb-0 pt-3 text-lg;
        }
      }

      &__content {
        @apply ml-8 p-0;
      }
    }
  }

  &:not(.checkout-address--active) {
    .checkout-address__items {
      .address-card {
        @apply border-0 bg-transparent;

        &__header {
          @apply pb-0 text-sm;
          .header__title {
            .subtitle {
              @apply font-sans text-sm font-normal;
            }
          }
        }
        &__content {
          @apply text-sm;
        }
      }
    }
  }

  &__submit {
    @apply flex w-full flex-grow justify-end gap-6 py-4;
  }
}
</style>
