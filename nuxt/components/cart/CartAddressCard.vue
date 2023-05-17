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
import CartAddressSelector from './CartAddressSelector.vue'
import AddressCard from '../address/AddressCard.vue'
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
  computed: {
    cart(): Ref<Cart | null> {
      return useCart()
    },
    address(): Address | null {
      if (this.type === 'delivery')
        return this.cart?.value?.delivery?.address || null
      else return this.cart?.value?.invoicing?.address || null
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
