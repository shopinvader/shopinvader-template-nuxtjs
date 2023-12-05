<template>
  <div v-if="product !== null" class="product-cart">
    <slot name="input" :product="product" :qty="qty">
      <input-qty
        v-if="!disabledAddToCart"
        class="product-cart__input"
        @change="updateQty"
      ></input-qty>
    </slot>
    <slot name="add" :product="product" :qty="qty">
      <button
        type="button"
        class="product-cart__add"
        :disabled="disabledAddToCart"
        @click="addToCart"
      >
        <div v-if="!disabledAddToCart" class="add-icon">
          <icon name="clarity:shopping-bag-line" class="text-xl lg:text-2xl" />
          <icon name="ic:outline-plus" class="add-icon__plus" />
        </div>
        <span class="add-label">
          {{ label || $t('product.cart.add') }}
        </span>
      </button>
    </slot>
    <slot name="count" :count="line?.qty">
      <div v-if="line && !disabledAddToCart" class="product-cart__count">
        {{ $t('cart.line.count', { count: line?.qty || 0 }) }}
        <nuxt-link class="text-secondary underline" :to="localePath('cart')">
          {{ $t('cart.link') }}
        </nuxt-link>
      </div>
    </slot>
  </div>
  <aside-drawer :open="cartDrowerOpened" direction="right" @close="closeDrawer">
    <template #header>
      <div class="w-full text-2xl">
        {{ $t('cart.title') }}
      </div>
    </template>
    <template #content>
      <div class="cart-confirmation">
        <slot name="addedtocart-content" :line="line">
          <div class="cart-confirmation__title">
            <icon name="check" class="icon" />
            {{ $t('cart.confirmation') }}
            <div class="flex-1 text-right">
              <nuxt-link
                class="btn-secondary btn-sm btn"
                :to="localePath('cart')"
              >
                <icon name="cart" class="mr-2"></icon>
                {{ $t('cart.checkout') }}
              </nuxt-link>
            </div>
          </div>
          <cart-line
            v-if="line"
            class="cart-confirmation__line"
            :line="line"
            :readonly="true"
          >
          </cart-line>
          <product-links
            v-if="product"
            class="cart-confirmation__links"
            :links="product.links?.crossLink || []"
          >
            <template #head>
              <h2 class="text-xl">{{ $t('product.cross_selling.title') }}</h2>
            </template>
          </product-links>
        </slot>
      </div>
    </template>
    <template #footer>
      <slot name="addedtocart-footer" :line="line">
        <button
          :to="localePath('cart')"
          type="button"
          class="btn-outline btn"
          @click="closeDrawer"
        >
          {{ $t('cart.continue') }}
        </button>
        <nuxt-link :to="localePath('cart')" class="btn-secondary btn">
          <icon name="cart" class="mr-2"></icon>
          {{ $t('cart.checkout') }}
        </nuxt-link>
      </slot>
    </template>
  </aside-drawer>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import { CartLine, Product } from '#models'
export default {
  name: 'ProductCart',
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    },
    disableWhenNoStock: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    }
  },
  emits: {
    /**  Emit when the quantity is updated */
    update: (qty: number) => true,
    /** Emit when the product is added to the cart */
    add: (qty: number) => true
  },
  data() {
    return {
      cartDrowerOpened: false as boolean,
      qty: 1 as number
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
    stockState():string | null {
      return this.product?.stock?.global?.state || null
    },
    lines(): CartLine[] {
      const cartService = useShopinvaderService('cart')
      const cart = cartService.getCart()
      return cart?.value?.lines as CartLine[]
    },
    /**
     * Check if the product has stock
     */
    disabledAddToCart(): boolean {
      if (!this.disableWhenNoStock || !this.product.stock) {
        return false
      }
      if (this.disabled) {
        return true
      }
      return this?.stockState === 'out_of_stock'
    }
  },
  methods: {
    addToCart() {
      if (this.disabledAddToCart) {
        return false
      }
      const cartService = useShopinvaderService('cart')
      if (cartService && this.product?.id !== null) {
        this.$emit('add', this.qty)
        cartService.addItem(this.product.id, this.qty)
        if (!this.line) {
          this.cartDrowerOpened = true
        }
      }
    },
    closeDrawer(): void {
      this.cartDrowerOpened = false
    },
    updateQty(qty: number) {
      if (this.disabledAddToCart) {
        return false
      }
      this.qty = qty
      this.$emit('update', qty)
    }
  }
}
</script>
<style lang="scss">
.product-cart {
  @apply flex flex-row flex-wrap items-center justify-end gap-2;
  &__add {
    @apply btn-primary btn px-14  text-white hover:btn-primary hover:shadow-2xl;
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
  &__count {
    @apply flex w-full flex-grow justify-end gap-2 text-right text-sm;
  }
}
.aside-drawer {
  .cart-confirmation {
    &__title {
      @apply flex w-full items-center gap-3 p-2 align-middle text-2xl;
      .icon {
        @apply text-success;
      }
    }
    &__line {
      @apply border-l-0 border-r-0;
    }
    &__links {
      .product-links__items {
        @apply grid grid-cols-2 gap-1 md:grid-cols-3;
        .items__product {
          .product-hit {
            @apply card border bg-base-100;
          }
        }
      }
    }
  }
}
</style>
