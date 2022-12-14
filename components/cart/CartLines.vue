<template>
  <div class="cart-lines">
    <div v-if="lines == null">
      <spinner></spinner>
    </div>
    <CartLine
      v-else-if="lines.length > 0"
      v-for="line in lines"
      :key="line.id"
      :line="line"
    >
    </CartLine>
    <div v-else>
      {{ $t('cart.empty') }}
    </div>
  </div>
</template>
<script lang="ts">
import CartLine from '~/components/cart/CartLine.vue'
import SpinnerVue from '../global/Spinner.vue'
export default({
  name: 'CartLines',
  components: {
    'cart-line':CartLine,
    'spinner': SpinnerVue 
  },
  computed: {
    cart() {
      return 
    },
    lines() {
      return useCart()?.lines || null
    }
  }
})
</script>