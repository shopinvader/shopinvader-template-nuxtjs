<template>
  <div class="cart-lines">
    <cart-line v-for="line in lines" :key="line.id" :line="line"> </cart-line>
  </div>
</template>
<script lang="ts">
import CartLineVue from '~/components/cart/CartLine.vue'
import { CartLine } from '~~/models'
export default {
  name: 'CartLines',
  components: {
    'cart-line': CartLineVue
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
<style lang="scss">
.cart-lines {
  @apply flex h-full w-full flex-col items-center justify-stretch;
  .cartline {
    @apply w-full;
  }
}
</style>
