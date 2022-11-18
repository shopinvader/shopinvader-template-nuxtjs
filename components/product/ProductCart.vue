<template>
  <div v-if="product !== null" 
    class="product-cart"
  >
    <slot name="price" v-bind:product="product" v-bind:cartLine="cartLine">
      <button class="btn btn-primary">
        Add to cart
      </button>
    </slot>
  </div>
  <product-qty></product-qty>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { Product } from '~~/models/Product';
import ProductQty from '~/components/product/ProductQty.vue';
export default {
  name: 'ProductCart',
  components: {
    'product-qty': ProductQty
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