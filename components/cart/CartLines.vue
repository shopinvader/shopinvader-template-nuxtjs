<template>
  <div>
    <CartLine
      v-if="lines.length > 0"
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
export default({
  name: 'CartLines',
  components: {
    CartLine
  },
  setup() {
  const cart = useCart()
   if(cart != null) {
      return {
        lines: computed(() => cart?.lines || [] ),
        cart: computed(() => cart)
      }
   }
   return {
      lines: [],
      cart: null
   }
  }
})
</script>