<template>
  <div class="product-stock">
    <!-- case stock found -->
    <div v-if="stockQty > 0" class="product-stock__positive">
      <icon class="icon" icon="iconamoon:delivery-free-bold" /><p>{{ $t('product.stock.in_stock') }}: <span class="positive__qty">{{ stockQty }}</span></p>
    </div>
    <!-- case stock not found  -->
    <div v-else class="product-stock__negative">
      <icon icon="jam:alert-f" /><p>{{ $t('product.stock.out_of_stock') }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import {ProductStock}  from '~/models/ProductStock'
import { PropType } from 'vue'
export default {
  props: {
    stock: {
      type: Object as PropType<ProductStock>,
      required: true
    }
    },
    setup(props) {
      let stockQty = props.stock?.global?.qty || 0 
      return {stockQty}      
    },
  }
</script>
<style lang="scss">
.product-stock {
  @apply pb-3;
  &__positive {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 0.5rem;
    & .icon {
      font-size: 1.5rem;  
      @apply text-success;        
      }
  .positive {
    &__qty {
      @apply text-success font-bold;    
    }
  }
 }
&__negative {
  @apply text-error font-bold;
  }
}




</style>