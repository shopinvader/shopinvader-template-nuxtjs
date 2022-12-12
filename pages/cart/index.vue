<template>
  <div class="py-5">
    <div class="text-xl py-5">
      {{ $t('cart.title') }}
    </div>
    <div class="flex flex-wrap">
      <div class="w-full lg:w-1/2 xl:w-2/3">
        <cart-lines></cart-lines>
      </div>
      <div class="w-full lg:w-1/2 xl:w-1/3">
        <cart-total class="mx-2"></cart-total>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import CartLines from '~/components/cart/CartLines.vue'
import CartTotal from '~/components/cart/CartTotal.vue'

export default({
  name: 'Cart',
  components: {
    'cart-lines': CartLines,
    'cart-total': CartTotal
  }
})
</script>