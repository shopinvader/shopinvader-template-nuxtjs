<template>
  <div v-if="price !== null" class="product-price" :class="cssClass">
    <slot name="price" :price="price">
      <div v-if="hasDiscount" class="product-price__original">
        {{ formatCurrency(price.original_value) }}
      </div>
      <div class="product-price__value" :class="{ 'product-price__value--discount': hasDiscount }">
        {{ formatCurrency(price.value) }}
      </div>
      <sub v-if="price.tax_included" class="product-price__tax">
        {{ $t('product.price.tax_included') }}
      </sub>
      <sub v-else class="product-price__tax">
        {{ $t('product.price.tax_excluded') }}
      </sub>
    </slot>
  </div>
</template>
<script lang="ts" setup>
import type { ProductPrice } from '#models'
import type { PropType } from 'vue'
import { formatCurrency } from '~/utils/StringHelper'

const props = defineProps({
  price: {
    type: Object as PropType<ProductPrice>,
    required: true
  },
  cssClass: {
    type: String,
    default: ''
  }
})

const hasDiscount = computed(() => {
  return props.price.original_value !== props.price.value
})
</script>
<style lang="scss">
.product-price {
  @apply flex w-full flex-wrap items-center justify-end gap-x-1;
  &__value {
    @apply pb-0 text-3xl font-semibold leading-6;
    &--discount {
      @apply text-3xl text-error;
    }
  }
  &__tax {
    @apply text-xs font-normal text-gray-500;
  }
  &__original {
    @apply text-lg font-normal text-gray-500 line-through;
  }
}
</style>
