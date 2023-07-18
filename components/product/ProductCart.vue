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
      <span class="add-label">{{ $t('product.cart.add') }} </span>
    </button>

    <cart-line-qty v-else :line="line"></cart-line-qty>
  </div>
  <aside-drawer :open="cartDrowerOpened" @close="closeDrawer">
    <template #header>
      <div class="w-full text-2xl">
        {{ $t('cart.title') }}
      </div>
    </template>
    <template #content>
      <transition name="cart-confirm">
        <div v-if="cartModified" class="cart-confirmation">
          <icon icon="mdi:check" class="mr-2" />
          {{ $t('cart.confirmation') }}
        </div>
      </transition>
      <cart @update-cart="test"> </cart>
    </template>
  </aside-drawer>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { CartLine } from '~~/models'
import { Product } from '~~/models/Product'
import CartLineQtyVue from '../cart/CartLineQty.vue'
import AsideDrawer from '~/components/global/AsideDrawer.vue'
import Cart from '~/components/cart/Cart.vue'
export default {
  name: 'ProductCart',
  components: {
    'cart-line-qty': CartLineQtyVue,
    'aside-drawer': AsideDrawer,
    cart: Cart
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  data() {
    return {
      cartDrowerOpened: false as boolean,
      cartModified: false as boolean
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
    },
    lines(): CartLine[] {
      const cartService = useShopinvaderService('cart')
      const cart = cartService.getCart()
      return cart?.value?.lines as CartLine[]
    }
  },
  watch: {
    lines(): void {
      this.cartModified = true
      setTimeout(() => {
        this.cartModified = false
      }, 1000)
    }
  },
  methods: {
    addToCart() {
      const cartService = useShopinvaderService('cart')
      if (cartService && this.product?.id !== null) {
        cartService.addItem(this.product.id, 1)
        this.cartDrowerOpened = true
      }
    },
    closeDrawer(): void {
      this.cartDrowerOpened = false
    },
    test() {
      console.log('updatedcart')
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

.aside-drawer {
  @apply fixed left-auto right-0 top-0 z-50 flex items-start justify-start;
  &-enter-to,
  &-leave-from {
    opacity: 1;

    .aside-drawer__side {
      right: 0;
    }
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;

    .aside-drawer__side {
      right: -100%;
    }
  }
  .side__header {
    @apply w-full 
  }
  .side__content {
    @apply h-full;
    .cart-confirmation {
      @apply flex w-full  items-center bg-gray-200 p-2 align-middle text-success;
    }
    .cart-confirm-enter-active,
    .cart-confirm-leave-active {
      @apply transition-all duration-200 ease-in-out;
    }
    .cart-confirm-enter-from,
    .cart-confirm-leave-to {
      @apply bg-gray-100;
    }
  }
  &__side {
    @apply absolute left-auto right-0 h-screen w-10/12 max-w-screen-sm overflow-y-auto bg-white shadow-xl ;
  }
  .side__footer {
    @apply hidden;
  }
  .cart {
    @apply flex flex-col place-content-between justify-between w-full;
  }
}
</style>
