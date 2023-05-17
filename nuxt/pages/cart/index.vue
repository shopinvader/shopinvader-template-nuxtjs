<template>
  <nuxt-layout name="checkout">
    <template #header>
      <h1>
        {{ $t('cart.title') }}
      </h1>
    </template>
    <template v-if="cart" #body>
      <div class="cart">
        <div class="cart__lines">
          <cart-lines :lines="cart?.lines"></cart-lines>
        </div>
        <div class="cart__total">
          <cart-total class="">
            <template #footer>
              <nuxt-link
                class="btn-secondary btn mt-6 w-full"
                :to="{ path: '/cart/address' }"
              >
                {{ $t('cart.summary.checkout') }}
                <icon
                  icon="material-symbols:chevron-right"
                  class="text-lg"
                ></icon>
              </nuxt-link>
            </template>
          </cart-total>
        </div>
      </div>
      <product-history></product-history>
    </template>
  </nuxt-layout>
</template>
<script lang="ts">
import CartLines from '~/components/cart/CartLines.vue'
import CartTotal from '~/components/cart/CartTotal.vue'
import ProductHistory from '~/components/product/ProductHistory.vue'
import { Cart } from '~~/models'

export default defineNuxtComponent({
  name: 'Cart',

  components: {
    'cart-lines': CartLines,
    'cart-total': CartTotal,
    'product-history': ProductHistory
  },
  computed: {
    cart(): Cart | null {
      return useCart().value
    }
  },
  setup() {
    const i18n = useI18n()
    useHead({
      title: i18n.t('cart.title')
    })
    definePageMeta({
      layout: false
    })
  }
})
</script>
<style lang="scss">
.cart {
  @apply flex h-full gap-4 pb-10;
  &__lines {
    @apply w-full flex-grow lg:w-2/3;
    .cart-lines {
      @apply w-full;
    }
  }
  &__total {
    @apply w-full lg:w-1/3;
  }
}
</style>
