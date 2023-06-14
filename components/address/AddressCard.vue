<template>
  <div class="address-card">
    <div class="address-card__header">
      <div class="header__title">
        <slot name="header" :address="address">
          <div class="flex items-center gap-2">
            <icon
              v-if="address?.addressType !== 'profile'"
              icon="ic:sharp-location-on"
              class="text-xl text-primary"
            ></icon>
            <icon
              v-else
              icon="ic:outline-account-circle"
              class="text-xl text-primary"
            ></icon>

            <span class="mx-1">{{ address?.name }}</span>
          </div>
        </slot>
      </div>
      <div class="header__actions">
        <slot name="actions" :address="address"></slot>
      </div>
    </div>
    <div class="address-card__content">
      <slot name="body" :address="address">
        <template v-if="!edit">
          <p>{{ address?.email }}</p>
          <span v-if="address && address?.addressType !== 'profile'">
            <p>{{ address?.street }}</p>
            <p>
              {{ address.zip }} {{ address.city }} - {{ address.country?.name }}
            </p>
            <p v-if="address.phone !== null">
              {{ address.phone }}
            </p>
            <p v-if="address.mobile !== null">
              {{ address.mobile }}
            </p>
          </span>
        </template>
        <address-form v-else-if="address" :address="address"></address-form>
      </slot>
    </div>
    <div class="address-card__footer">
      <slot name="footer" :address="address"> </slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Icon } from '@iconify/vue'
import { PropType } from 'vue'
import { Address } from '~/models'
import AddressFormVue from './AddressForm.vue'
export default defineNuxtComponent({
  name: 'AddressCard',
  components: {
    'address-form': AddressFormVue,
    icon: Icon
  },
  props: {
    address: {
      type: Object as PropType<Address | null>,
      required: true
    }
  },
  data() {
    return {
      edit: false
    }
  },
  setup() {
    return {}
  }
})
</script>
<style lang="scss">
.address-card {
  @apply rounded bg-base-100 p-6 shadow-xl;

  &__header {
    @apply flex items-center justify-between gap-4 text-2xl font-bold;
    .header__actions {
      @apply flex justify-end gap-2;
    }
    .header__title {
      @apply text-base;
    }
  }

  &__content {
    @apply py-3 pl-4;
  }
}
</style>
