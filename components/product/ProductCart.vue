<template>
  <div v-if="product !== null" 
    class="product-cart"
  >
    <slot name="price" v-bind:product="product" v-bind:cartLine="cartLine">
      <button class="btn btn-primary" type="button" @click="addToCart">
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
  },
  methods: {
    addToCart() {
      const cartService = useShopinvaderServices()?.cart
      if(cartService) {
        cartService.addProduct(this.product, 1)
      }
      console.log('addToCart');
    } 
  }
}
</script>
<style lang="scss">
.product-cart {
  display: flex;
}
</style>