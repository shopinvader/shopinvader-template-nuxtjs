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
  </div>
</template>
<script lang="ts">
import CartLineVue from '~/components/cart/CartLine.vue'
import { CartLine } from '~~/models';
import SpinnerVue from '../global/Spinner.vue'
export default({
  name: 'CartLines',
  props: {
    lines: {
      type: Array<CartLine>,
      default: null
    }
  },
  components: {
    'cart-line':CartLineVue,
    'spinner': SpinnerVue
  },
  computed: {

  }
})
</script>
