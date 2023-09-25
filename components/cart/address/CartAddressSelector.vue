<template>
  <address-list :type="types">
    <template #address-header="{ address }">
      <div class="form-control">
        <label class="label cursor-pointer">
          <input
            type="radio"
            name="title"
            class="radio"
            :value="address.id"
            :checked="selectedAddress?.id == address?.id"
            @click="onSelectedAddress(address)"
          />
          <span class="label-text pl-2">
            {{ address.name }}
          </span>
        </label>
      </div>
    </template>
    <template #address-footer="{ address }">
      <div class="flex justify-end">
        <button
          type="button"
          class="btn btn-sm btn-primary"
          @click="onSelectedAddress(address)"
        >
          {{ $t('cart.address.pick') }}
        </button>
      </div>
    </template>
  </address-list>
</template>
<script lang="ts">
import { PropType } from 'vue'

import { Address } from '~/models'
import AddressList from '~~/components/address/AddressList.vue'
export default defineNuxtComponent({
  name: 'cart-address',
  events: ['select'],
  components: {
    'address-list': AddressList
  },
  props: {
    types: {
      type: String,
      required: true
    },
    selectedAddress: {
      type: Object as PropType<Address | null>,
      required: false,
      default: () => {
        return null
      }
    }
  },
  methods: {
    onSelectedAddress(address: Address) {
      this.$emit('select', new Address(address.data))
    }
  }
})
</script>
