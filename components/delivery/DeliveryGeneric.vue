<template>
  <div
    class="method"
    :class="{
      'method--selected': selected
    }"
    @click="emit('select', deliveryCarrier)"
  >
    <div class="method__icon">
      <icon name="carrier" />
    </div>
    <div class="method__body">
      <div class="body__title">
        <slot name="title" :delivery-carrier="deliveryCarrier">
          {{ deliveryCarrier.name }}
        </slot>
      </div>
      <div class="body__description">
        <slot name="description" :delivery-carrier="deliveryCarrier">
          {{ deliveryCarrier.description }}
        </slot>
      </div>
      <slot name="error" :error="error">
        <div v-if="selected && error" class="body__error">
          {{ t('error.generic') }}
        </div>
      </slot>
      <slot name="dropoff" :delivery-carrier="deliveryCarrier" :on-select-pickup="selectPickup">
        <DeliveryPickupSelector
          v-if="selected && deliveryCarrier?.withDropoffSite"
          :carrier="deliveryCarrier"
          @select="selectPickup"
        />
      </slot>
    </div>
    <div class="method__price">
      <template v-if="deliveryCarrier?.price && deliveryCarrier?.price > 0">
        {{ formatCurrency(deliveryCarrier.price) }}
      </template>
      <template v-else>
        {{ t('cart.delivery.method.free') }}
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'
import type { DeliveryPickupPoint, DeliveryCarrier } from '#models'
import { formatCurrency } from '~/utils/StringHelper'
import DeliveryPickupSelector from './DeliveryPickupSelector.vue'

const emit = defineEmits(['select'])
defineProps({
  deliveryCarrier: {
    type: Object as PropType<DeliveryCarrier>,
    required: true
  },
  selected: {
    type: Boolean,
    required: false
  }
})
const { t } = useI18n()
const error = ref(false)
const cartService = useShopinvaderService('cart')

const selectPickup = async (dropoff: DeliveryPickupPoint) => {
  try {
    error.value = false
    await cartService.setPickupPoint(dropoff)
  } catch (e) {
    console.error(e)
    error.value = true
  }
}
</script>
<style lang="scss">
.method {
  @apply flex w-full cursor-pointer gap-2 rounded border p-4 transition-all duration-300 ease-in-out hover:border-primary hover:shadow-md;
  &--selected {
    @apply border-2 border-primary shadow-lg;
  }
  &__icon {
    @apply text-primary;
  }
  &__body {
    @apply w-full flex-grow;
    .body {
      &__title {
        @apply flex items-center justify-start font-bold;
      }
      &__description {
        @apply text-gray-500;
      }
      &__error {
        @apply text-error;
      }
    }
  }
  &__price {
    @apply flex justify-end text-right font-bold text-primary;
  }
}
</style>
