<template>
  <div class="cart-lines">
    <slot name="lines" :lines="lines">
      <cart-line
        v-for="(line, index) in lines"
        :key="line.id"
        :line="line"
        :readonly="readonly"
        v-animate="{ name: 'cartLines', index }"
      >
      </cart-line>
    </slot>
  </div>
</template>
<script lang="ts" setup>
import type { CartLine } from '#models'
/**
 * Display the cart's lines
 * This component is used in the component Cart
 * This component loop on the cart's lines and display the component CartLine
 */
defineProps({
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
