<template>
  <div v-if="product !== null" class="product-cart" :class="cssClass">
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
          <icon name="cart" class="text-xl lg:text-2xl" />
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
        <nuxt-link class="text-secondary underline" :to="localePath('cart') || 'cart'">
          {{ $t('cart.link') }}
        </nuxt-link>
      </div>
    </slot>
  </div>
  <aside-drawer
    :open="cartDrowerOpened"
    direction="right"
    @close="closeDrawer"
    class-content="cart-confirmation"
  >
    <template #header>
      <div class="cart-confirmation__header">
        {{ $t('cart.title') }}
      </div>
    </template>
    <template #content>
      <div class="cart-confirmation__content">
        <slot name="addedtocart-content" :line="line" class="content">
          <div class="content__title">
            <icon name="check" class="icon" />
            {{ $t('cart.confirmation') }}
          </div>
          <cart-line v-if="line" class="content__line" :line="line" :readonly="true"> </cart-line>
          <product-links
            v-if="product"
            class="content__links"
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
      <div class="cart-confirmation__footer">
        <slot name="addedtocart-footer" :line="line">
          <button type="button" class="btn-back" @click="closeDrawer">
            {{ $t('cart.continue') }}
          </button>
          <button @click="gotToCart" class="btn-checkout">
            <icon name="cart"></icon>
            {{ $t('cart.checkout') }}
          </button>
        </slot>
      </div>
    </template>
  </aside-drawer>
</template>
<script lang="ts">
import type { CartLine, Product } from '#models'
import type { PropType } from 'vue'
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
    },
    cssClass: {
      type: String,
      default: ''
    }
  },
  emits: {
    /**  Emit when the quantity is updated */
    update: (_qty: number) => true,
    /** Emit when the product is added to the cart */
    add: (_qty: number) => true
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
        cart?.value?.lines?.find((line: CartLine) => line.productId === this.product.id) || null
      )
    },
    stockState(): string | null {
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
        this.cartDrowerOpened = true
      }
    },
    gotToCart() {
      this.closeDrawer()
      const router = useRouter()
      const localePath = useLocalePath()
      router.push(localePath('cart'))
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
    @apply btn btn-primary px-14 text-white hover:btn-primary hover:shadow-2xl;
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
    &__header {
      @apply w-full text-lg md:text-2xl;
    }
    &__content {
      @apply w-full;
      .content {
        &__title {
          @apply flex w-full items-center gap-3 pb-2 align-middle text-lg md:text-2xl;
          .icon {
            @apply text-success;
          }
        }
        &__line {
          @apply flex flex-nowrap items-center justify-start gap-2 border-l-0 border-r-0 py-2;
          .cartline {
            &__content {
              @apply flex flex-grow flex-col justify-start gap-0;
              .content__title {
                @apply flex flex-col items-start justify-start gap-1 pb-0;
              }
              .content__qty {
                .label {
                  @apply block justify-start p-0 text-sm;
                }
              }
              .content__price {
                @apply flex flex-row justify-start p-0 leading-3;
                .label {
                  @apply p-0 text-sm;
                }
                .value .price__value {
                  @apply p-0 text-base font-normal text-secondary-950;
                }
              }
            }
            &__image {
              @apply h-16 w-16;
            }
          }
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
    &__footer {
      @apply flex w-full items-center justify-between gap-2;
      .btn-back {
        @apply btn btn-outline max-md:hidden;
      }
      .btn-checkout {
        .icon {
          @apply text-xl;
        }
        @apply btn btn-success px-8 text-white shadow-2xl max-md:btn-block;
      }
    }
  }
}
</style>
