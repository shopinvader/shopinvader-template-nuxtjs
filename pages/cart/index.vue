<template>
  <div>
    CART
    <cart-lines></cart-lines>
  </div>
</template>
<script lang="ts">
import  CartLines from '~/components/cart/CartLines.vue'

export default({
  name: 'Cart',
  components: {
    'cart-lines': CartLines
  }
})
</script>