<template>
  <div
    class="method"
    :class="{
      'method--selected': selected
    }"
    @click="$emit('select', deliveryCarrier)"
  >
    <div class="method__icon">
      <icon icon="solar:box-line-duotone" />
    </div>
    <div class="method__body">
      <div class="body__title">
        {{ deliveryCarrier.name }}
      </div>
      <div class="body__description">
        {{ deliveryCarrier.description }}
      </div>
    </div>
    <div class="method__price">
      {{ $filter.currency(deliveryCarrier.price) }}
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { DeliveryCarrier } from '~/models'

export default {
  name: 'DeliveryGeneric',
  props: {
    deliveryCarrier: {
      type: Object as PropType<DeliveryCarrier>,
      required: true
    },
    selected: {
      type: Boolean,
      required: false
    }
  },
  emits: ['select']
}
</script>
<style lang="scss">
.method {
  @apply flex w-full cursor-pointer gap-2 rounded border p-4 transition-all duration-300 ease-in-out hover:border-primary hover:shadow-md;
  &--selected {
    @apply border-2 border-primary shadow-lg;
  }
  &__icon {
    @apply text-5xl text-primary;
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
    }
  }
  &__price {
    @apply flex  justify-end font-bold text-primary;
  }
}
</style>
