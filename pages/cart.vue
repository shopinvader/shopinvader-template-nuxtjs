<template>
  <cart @next="submit" class="py-4">
    <template #footer>
      <product-history></product-history>
    </template>
  </cart>
</template>
<script lang="ts">
import CartVue from '~/components/cart/Cart.vue'
import ProductHistory from '~/components/product/ProductHistory.vue'
import { Cart } from '~~/models'

export default defineNuxtComponent({
  name: 'Cart',

  components: {
    cart: CartVue,
    'product-history': ProductHistory
  },
  computed: {
    lineCount(): number {
      return this.cart?.lines.length || 0
    }
  },
  setup() {
    const i18n = useI18n()
    const cartService = useShopinvaderService('cart')
    const cart = cartService.getCart()
    useHead({
      title: i18n.t('cart.title'),
      cart
    })
  },
  methods: {
    submit() {
      const localePath = useLocalePath()
      this.$router.push(localePath('/checkout'))
    }
  }
})
</script>
<style lang="scss"></style>
