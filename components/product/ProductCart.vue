<template>
  <template v-if="product !== null">
    <button v-if="line == null" type="button" class="btn btn-primary mt-5" @click="addToCart">
      {{ $t('cart.line.add') }}
    </button>
    <cart-line-qty v-else :line="line"></cart-line-qty>
  </template>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { CartLine } from '~~/models';
import { Product } from '~~/models/Product'
import CartLineQtyVue from '../cart/CartLineQty.vue';
export default {
  name: 'ProductCart',
  components: {
    'cart-line-qty': CartLineQtyVue
  },
  props: {
    product: {
      type:  Object as PropType<Product>,
      required: true
    }
  },
  computed: {
    line():CartLine | null {
      const cart = useCart()
      return cart?.lines?.find((line:CartLine) => line.productId === this.product.id) || null
    }
  },
  methods: {
    addToCart() {
      const cartService = useShopinvaderServices()?.cart
      if(cartService && this.product !== null) {
        cartService.addItem(this.product.id, 1)
      }
      console.log('addToCart');
    } 
  }
}
</script>
