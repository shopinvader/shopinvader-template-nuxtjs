<template>
  <div v-if="price !== null" class="product-price">
    <slot name="price" :price="price">
      <div v-if="hasDiscount" class="product-price__original">
        {{ $filter.currency(price.original_value) }}
      </div>
      <div class="product-price__value" :class="{ 'product-price__value--discount': hasDiscount }">
        {{ $filter.currency(price.value) }}
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
<script lang="ts">
import type { ProductPrice } from '#models'
import type { PropType } from 'vue'
export default {
  name: 'ProductPrice',
  props: {
    price: {
      type: Object as PropType<ProductPrice>,
      required: true
    }
  },
  computed: {
    hasDiscount(): boolean {
      return this.price.original_value !== this.price.value
    }
  }
}
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
