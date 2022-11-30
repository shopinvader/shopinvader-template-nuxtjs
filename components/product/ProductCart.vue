<template>
  <div v-if="product !== null" 
    class="product-cart"
  >
    <slot name="price" v-bind:product="product" v-bind:cartLine="cartLine">
      <button class="btn btn-primary">
        {{ $t('product.cart.add') }}
      </button>
    </slot>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { Product } from '~~/models/Product';

export default {
  name: 'ProductCart',
  components: {
    
  },
  props: {
    product: {
      type:  Object as PropType<Product>,
      required: true
    }
  },
  computed: {
    cartLine() {
      return null;
    }
  }
}
</script>
<style lang="scss">
.product-cart {
  display: flex;
}
</style>