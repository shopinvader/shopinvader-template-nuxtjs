<template>
  <div class="address-card">
    <div class="address-card__header">
      <icon icon="ic:sharp-location-on" class="text-xl text-primary"></icon>
      {{ address?.title?.name || '' }}
      {{ address.name }}
    </div>
    <div class="address-card__content">
      <template v-if="!edit">
        <p>{{ address.email }}</p>
        <p>{{ address.street }}</p>
        <p>
          {{ address.zip }} {{ address.city }} - {{ address.country?.name }}
        </p>
        <p v-if="address.phone !== null">
          {{ address.phone }}
        </p>
        <p v-if="address.mobile !== null">
          {{ address.mobile }}
        </p>
      </template>
      <address-form v-else :address="address"></address-form>
    </div>
    <div class="address-card__footer">
      <slot name="footer" :address="address">
        <div class="footer__actions">
          <slot name="actions" :address="address"></slot>
        </div>
      </slot>
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
      type: Object as PropType<Address>,
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
    @apply flex items-center text-2xl font-bold;
  }

  &__content {
    @apply py-3 pl-4;
  }

  &__footer {
    @apply flex justify-end;

    .footer__actions {
      @apply flex justify-end gap-4;
    }
  }
}
</style>
