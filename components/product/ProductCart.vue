<template>
  <div v-if="product !== null" class="product-cart">
    <button
      v-if="line == null"
      type="button"
      class="product-cart__add"
      @click="addToCart"
    >
      <div class="add-icon">
        <Icon icon="clarity:shopping-bag-line" class="text-xl lg:text-2xl" />
        <Icon icon="ic:outline-plus" class="add-icon__plus" />
      </div>
      <span class="add-label">{{ $t('product.cart.add') }}</span>
    </button>
    <cart-line-qty v-else :line="line"></cart-line-qty>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { CartLine } from '~~/models'
import { Product } from '~~/models/Product'
import CartLineQtyVue from '../cart/CartLineQty.vue'
export default {
  name: 'ProductCart',
  components: {
    'cart-line-qty': CartLineQtyVue
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  computed: {
    line(): CartLine | null {
      const cartService = useShopinvaderService('cart')
      const cart = cartService.getCart()
      return (
        cart?.value?.lines?.find(
          (line: CartLine) => line.productId === this.product.id
        ) || null
      )
    }
  },
  methods: {
    addToCart() {
      const cartService = useShopinvaderService('cart')
      if (cartService && this.product?.id !== null) {
        cartService.addItem(this.product.id, 1)
      }
    }
  }
}
</script>
<style lang="scss">
.product-cart {
  @apply flex flex-row items-center justify-center;
  &__add {
    @apply btn-secondary btn px-14  text-white hover:btn-secondary hover:shadow-2xl;
    .add-label {
      @apply ml-2;
    }
    .add-icon {
      @apply relative flex items-center justify-center;
      background-color: inherit;
      &__plus {
        @apply absolute -bottom-1 right-1;
        background-color: inherit;
      }
    }
  }
}
</style>
