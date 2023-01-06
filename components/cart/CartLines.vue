<template>
  <div class="cart-lines">
    <div v-if="lines == null">
      <spinner></spinner>
    </div>
    <cart-line
      v-for="line in lines"
      v-else-if="lines.length > 0"
      :key="line.id"
      :line="line"
    >
    </cart-line>
  </div>
</template>
<script lang="ts">
import CartLineVue from '~/components/cart/CartLine.vue'
import { CartLine } from '~~/models'
import SpinnerVue from '../global/Spinner.vue'
export default {
  name: 'CartLines',
  components: {
    'cart-line': CartLineVue,
    spinner: SpinnerVue
  },
  props: {
    lines: {
      type: Array<CartLine>,
      default: null
    }
  },
  computed: {}
}
</script>
