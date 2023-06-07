<template>
  <div class="cart-lines">
    <cart-line
      v-for="line in lines"
      :key="line.id"
      :line="line"
      :readonly="readonly"
    >
    </cart-line>
  </div>
</template>
<script lang="ts">
import CartLineVue from '~/components/cart/CartLine.vue'
import { CartLine } from '~~/models'
/**
 * Display the cart's lines
 * This component is used in the component Cart
 * This component loop on the cart's lines and display the component CartLine
 */
export default defineNuxtComponent({
  name: 'CartLines',
  components: {
    'cart-line': CartLineVue
  },
  props: {
    /**  Cart's lines */
    lines: {
      type: Array<CartLine>,
      required: true,
      default: null
    },
    /**  If the cart is readonly. Readonly mode prevent to update the line's quantity*/
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {}
})
</script>
<style lang="scss">
.cart-lines {
  @apply flex h-full w-full flex-col items-center justify-stretch;
  .cartline {
    @apply w-full;
  }
}
</style>
