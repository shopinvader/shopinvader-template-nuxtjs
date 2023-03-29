<template>
  <div class="py-5">
    <div class="py-5 text-xl">
      {{ $t('cart.title') }}
    </div>
    <div v-if="lines?.length !== 0" class="flex flex-wrap">
      <div class="w-full lg:w-1/2 xl:w-2/3">
        <cart-lines :lines="lines"></cart-lines>
      </div>
      <div class="w-full lg:w-1/2 xl:w-1/3">
        <cart-total class="mx-2"></cart-total>
      </div>
    </div>
    <div v-else class="py-3 text-center">
      {{ $t('cart.empty') }}
    </div>
  </div>
</template>
<script lang="ts">
import CartLines from '~/components/cart/CartLines.vue'
import CartTotal from '~/components/cart/CartTotal.vue'
import { CartLine } from '~~/models'

export default {
  name: 'Cart',
  components: {
    'cart-lines': CartLines,
    'cart-total': CartTotal
  },
  computed: {
    lines(): CartLine[] {
      return useCart()?.lines || []
    }
  }
}
</script>
