<template>
  <div v-if="price !== null" 
    class="product-price"
  >
    <slot name="price" v-bind:price="price">
      <div>
        <div class="product-price__value">
          {{ $filter.currency(price.value) }}
        </div>
        <sub class="product-price__tax" v-if="price.tax_included">
          VAT Incl.
        </sub>
      </div>
      <div
        v-if="price.original_value !== price.value"
        class="product-price__original"
      >
        {{ $filter.currency(price.value) }}
      </div>
    </slot>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { ProductPrice } from '~~/models/ProductPrice';
export default {
  name: 'ProductPrice',
  props: {
    price: {
      type:  Object as PropType<ProductPrice>,
      required: true
    }
  }
}
</script>
<style lang="scss">
.product-price {

  display: flex;
  flex-direction: column;
  &__value {
    @apply pb-0 text-lg leading-3;
  }
  &__tax {
    @apply text-gray-500 text-xs font-normal;
  }
  &__original {
    @apply text-gray-500 line-through text-sm font-normal;
  }
}
</style>