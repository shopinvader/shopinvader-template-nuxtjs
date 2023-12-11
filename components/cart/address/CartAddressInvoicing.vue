<template>
  <address-card class="address" :address="invoicingAddress">
    <template #header>
      <h2 class="title">
        <icon name="billing"></icon>
        {{ $t('cart.address.billing.title') }}
      </h2>
      <div class="subtitle">
        {{ invoicingAddress?.name }}
      </div>
    </template>
    <template v-if="editable" #footer>
      <div class="cart-address-invoicing">
      <slot v-if="invoicingAddress" name="action" onOpen>
        <div class="cart-address-invoicing__btn">
          <button class="btn" @click="onOpen">
            <icon name="edit"></icon>
            <span class="pl-1">{{ $t('account.address.edit') }}</span>
          </button>
        </div>
      </slot>
      <aside-drawer
        :open="opened"
        @close="onClose"
        classContent="cart-address-invoicing__aside"
      >
        <template #header>
          <div class="aside__header">
            {{ $t('cart.address.billing.title') }}
          </div>
        </template>
        <template #content>
          <div v-if="hasSameAddresses" class="alert-same-address">
            <icon name="warning"></icon>
            <span>
              {{ $t('cart.address.billing.warning_same') }}
            </span>
          </div>
          <address-form v-if="value" :address="value" @saved="(e) => onUpdateAddress(e)"></address-form>
        </template>
      </aside-drawer>
    </div>
    </template>
  </address-card>
</template>
<script lang="ts">
import { Address } from '#models'
import { AddressForm } from '#components'

export default defineNuxtComponent({
  events: ['close', 'open'],
  name: 'cart-delivery-address',
  components: {
    'address-form': AddressForm
  },
  props: {
    /**
     * Is the current step of the checkout process
     */
     editable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  async setup() {
    const opened = ref(false)
    const cartService = useShopinvaderService('cart')
    const cart = cartService?.getCart() || ref(null)
    const value = ref(null) as Ref<Address | null>

    const invoicingAddress = computed(() => {
      const cartService = useShopinvaderService('cart')
      const cart = cartService.getCart()
      return cart.value?.invoicing?.address || null
    })
    const hasSameAddresses = computed(() => cart?.value?.delivery?.address?.id == invoicingAddress?.value?.id)

    return  {
      value,
      opened,
      hasSameAddresses,
      invoicingAddress
    }
  },
  methods: {
    async onUpdateAddress(address:Address | null) {
      if(!address) return null

      const addressService = useShopinvaderService('addresses')
      const addressSaved = await addressService?.update(address) || null

      if(addressSaved) {
        const cartService = useShopinvaderService('cart')
        await cartService.setAddress('invoicing', addressSaved)
      }
      this.onClose()
    },
    onClose() {
      this.value = null
      this.opened = false
      this.$emit('close')
    },
    async onOpen() {
      let data = this.invoicingAddress?.data || null
      if(!data) {
        const addressService = useShopinvaderService('addresses')
        let main = await addressService?.getMainAddress()
        data = main?.data || null
      }
      this.value = new Address({
        ...data,
        type: 'invoicing'
      })
      this.opened = true
      this.$emit('open')
    }
  },
  watch: {
    value(val) {
      this.$emit('select', val)
    }
  }
})
</script>
<style lang="scss">
.cart-address-invoicing {
  @apply w-full flex justify-end;
  .cart-address-invoicing__btn {
    .btn {
      @apply btn-link;
    }
  }
  &__aside {
    .aside__header {
      @apply font-heading text-2xl;
    }
    .alert-same-address {
      @apply alert alert-warning mb-4 flex gap-4 items-center;
      .iconify {
        @apply text-6xl;
      }
    }
  }
}
</style>
