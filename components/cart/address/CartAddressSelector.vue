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
          />
          <span class="label-text pl-2">
            {{ address.name }}
          </span>
        </label>
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
  }
})
</script>
