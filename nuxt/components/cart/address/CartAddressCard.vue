<template>
  <div class="cart-address-card">
    <div class="cart-address-card__header">
      <slot name="header">
        {{ type }}
      </slot>
    </div>
    <div class="cart-address-card__body">
      <slot name="body">
        <address-card v-if="address" :address="address">
          <template #actions>
            <button type="button" class="btn-sm btn-circle btn">
              <icon icon="ph:pencil" class=""></icon>
            </button>
          </template>
        </address-card>
      </slot>
    </div>
    <div class="cart-address-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import CartAddressSelector from '~/components/cart/address/CartAddressSelector.vue'
import AddressCard from '~/components/address/AddressCard.vue'
import { Icon } from '@iconify/vue'

import { Address, Cart } from '~/models'
export default defineNuxtComponent({
  name: 'cart-address-card',
  components: {
    'cart-address-selector': CartAddressSelector,
    'address-card': AddressCard,
    icon: Icon
  },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  setup() {
    const cartService = useShopinvaderService('cart')
    const cart = cartService.getCart()
    return { cart }
  },
  computed: {
    address(): Address | null {
      if (this.type === 'delivery') return this.cart?.delivery?.address || null
      else return this.cart?.invoicing?.address || null
    }
  }
})
</script>
<style lang="scss">
.cart-address-card {
  @apply flex flex-col flex-wrap gap-4 bg-slate-100;
  &__header {
    @apply heading text-xl font-bold uppercase;
  }
  &__body {
  }
  &__footer {
  }
}
</style>
