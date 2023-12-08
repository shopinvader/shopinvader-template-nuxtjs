<template>
  <div class="address-card">
    <div class="address-card__header">
      <div class="header__title">
        <slot name="header" :address="address">
          <div class="flex items-center gap-2">
            <icon
              v-if="address?.addressType !== 'profile'"
              name="location"
              class="text-xl text-primary"
            ></icon>
            <icon
              v-else
              name="user-circle"
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
          <div class="badge badge-primary" v-if="address?.main">
            {{ $t('address.main.title') }}
          </div>
          <p>{{ address?.email }}</p>
          <span v-if="address && address?.addressType !== 'profile'">
            <p>{{ address?.street }}</p>
            <p v-if="address?.street2">{{ address?.street2 }}</p>
            <p>
              {{ address.zip }} {{ address.city }}
              <span v-if="address.country">
                - {{ address.country?.name }}
              </span>
            </p>
            <div class="pt-4">
              <p v-if="address.phone" class="flex gap-2">
                <icon name="phone" class="text-lg"></icon>
                {{ address.phone }}
              </p>
              <p v-if="address.mobile" class="flex gap-2">
                <icon name="phone" class="text-lg"></icon>
                {{ address.mobile }}
              </p>
            </div>
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
import type { PropType } from 'vue'
import { Address } from '~/models'
import AddressFormVue from './AddressForm.vue'
export default defineNuxtComponent({
  name: 'AddressCard',
  components: {
    'address-form': AddressFormVue,
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
  @apply rounded-lg p-6 bg-base-100 ;

  &__header {
    @apply flex items-center justify-between gap-4 text-2xl font-bold;
    .header__actions {
      @apply flex justify-end gap-1;
    }
    .header__title {
      @apply font-heading;
    }
  }

  &__content {
    @apply py-3 pl-4;
  }
}
</style>
