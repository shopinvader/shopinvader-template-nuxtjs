<template>
  <div
    class="cartline"
    :class="{ 'cartline--pending': hasPendingTransactions }"
  >
    <div class="cartline__image">
      <!--
        @slot Cart line's image content
        @binding {ProductImage} images - images of the product cart line
      -->
      <slot v-if="product" name="image" :images="product?.images || null">
        <product-image
          v-if="product && product?.images && product.images.length > 0"
          :image="product.images[0]"
          class="product-hit__image"
          @click="linkToProduct()"
        >
        </product-image>
      </slot>
    </div>
    <div class="cartline__content">
      <div class="content__header">
        <!--
          @slot Content before the title
          @binding {CartLine} line - cart line
        -->
        <slot name="header" :line="line"></slot>
      </div>

      <div class="content__title">
        <!--
          @slot Title content
          @binding {CartLine} line - cart line
        -->
        <slot name="title" :line="line">
          <template v-if="product">
            <nuxt-link
              class="title"
              :to="localePath({ path: '/' + product.urlKey })"
            >
              {{ product?.model?.name || product?.name }}
            </nuxt-link>
            <ul class="shortTitle">
              <li v-for="[key, value] in attributes" :key="key">
                {{ value }}
              </li>
            </ul>
          </template>
          <template v-else>
            <div class="title">
              {{ line?.name }}
            </div>
          </template>
        </slot>
        <slot name="stock" :stock="stock">
          <product-stock v-if="product?.stock" :stock="product?.stock" />
        </slot>
      </div>

      <div class="content__qty">
        <!--
          @slot Quantity selector content
          @binding {CartLine} line - cart line
        -->
        <slot name="qty" :line="line">
          <div class="label">
            {{ $t('cart.line.quantity') }}
            <span v-if="readonly">{{ line?.qty }}</span>
          </div>
          <div class="value">
            <cart-line-qty v-if="!readonly" :line="line"></cart-line-qty>
          </div>
        </slot>
      </div>
      <div class="content__body">
        <!--
          @slot Body content
          @binding {CartLine} line - cart line
        -->
        <slot name="body" :line="line"></slot>
      </div>
      <div class="content__delete">
        <button
          v-if="!readonly"
          type="button"
          class="btn-link btn-xs btn p-0 text-xs"
          :title="$t('cart.line.delete')"
          @click="deleteLine"
        >
          <icon name="remove" class="text-xl" />
          {{ $t('cart.line.delete') }}
        </button>
      </div>

      <div class="content__price">
        <!--
          @slot price content
          @binding {CartLine} line - cart line
        -->
        <slot name="price" :line="line">
          <div class="label">
            {{ $t('cart.line.total') }}
          </div>
          <div class="value">
            <div
              v-if="amount && amount.totalWithoutDiscount !== amount.total"
              class="price__original"
            >
              {{ $filter.currency(amount.totalWithoutDiscount) }}***
            </div>
            <div class="price__value">
              {{ $filter.currency(amount.total) }}
            </div>
          </div>
        </slot>
      </div>
      <div class="content__footer">
        <!--
          @slot footer content
          @binding {CartLine} line - cart line
        -->
        <slot name="footer" :line="line"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import { CartLineAmount, CartLine } from '~/models'
import CartLineQtyVue from './CartLineQty.vue'
import ProductImageVue from '../product/ProductImage.vue'

/**
 * Display a line of the cart
 * @displayName Cart Line
 * @component CartLine
 * @example default
 */
export default defineNuxtComponent({
  name: 'CartLine',
  components: {
    'product-image': ProductImageVue,
    'cart-line-qty': CartLineQtyVue
  },
  props: {
    /**
     * The cart line to display
     */
    line: {
      type: Object as PropType<CartLine>,
      required: true,
      default: null
    },
    /**
     * If the line is readonly (can't be modified)
     */
    readonly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: {
    /**
     * Called after the line is deleted
     * @param line The current line
     */
    deleteLine: (line: any) => {
      return line instanceof CartLine
    }
  },
  setup() {
    const localePath = useLocalePath()
    return {
      localePath
    }
  },
  computed: {
    amount(): CartLineAmount {
      return this.line?.amount || new CartLineAmount({})
    },
    product() {
      return this.line?.product || false
    },
    hasPendingTransactions() {
      return this.line?.hasPendingTransactions || false
    },
    attributes() {
      if (!this.product) return []
      return Object.entries(this.product?.variantAttributes) || []
    }
  },
  methods: {
    /**
     * Redirect to the product page
     */
    linkToProduct() {
      if (this.product) {
        this.$router.push({
          path: '/' + this.product?.urlKey
        })
      }
    },
    deleteLine() {
      const cartService = useShopinvaderService('cart')
      if (cartService !== null) {
        cartService.deleteItem(this.line)
      }
      this.$emit('deleteLine', this.line)
    }
  }
})
</script>

<style lang="scss">
.cartline {
  @apply mb-2 flex flex-wrap justify-center border p-3 sm:flex-nowrap;
  &--pending {
    .cartline__content {
      .content__price .value {
        @apply animate-pulse blur;
      }
    }
  }
  &__image {
    @apply w-32;
  }
  &__content {
    @apply grid w-full auto-rows-min grid-cols-4 gap-2 px-4;
    .content {
      &__header {
        @apply col-span-4;
      }
      &__delete {
        @apply col-span-4 cursor-pointer text-sm max-sm:order-last md:col-span-3;
      }
      &__title {
        @apply col-span-4 leading-none md:col-span-3;
        .title {
          @apply flex-row text-sm font-bold uppercase md:line-clamp-1;
        }
        .shortTitle {
          @apply flex  divide-x divide-solid text-xs text-gray-500;
          li {
            @apply px-2 first:pl-0 last:pr-0;
          }
        }
      }
      &__body {
        @apply col-span-4 max-sm:order-first md:col-span-3;
      }
      &__qty {
        @apply col-span-3 flex flex-col text-sm sm:col-span-2  md:col-span-1 md:row-span-2;
        .cart-line-qty {
          @apply h-10 w-32 p-0;
          .input-group {
            @apply h-full items-center;
            .cartline-qty {
              &__btn {
                @apply h-full w-8 text-base;
              }
              &__input {
                @apply h-full  text-center text-base font-normal;
              }
            }
          }
        }
      }
      &__price {
        @apply flex flex-col items-center justify-between gap-2 pt-2 text-sm md:flex-row;
        .price {
          &__value {
            @apply pb-0 text-lg font-bold text-secondary leading-3;
          }
          &__tax {
            @apply text-xs font-normal text-gray-500;
          }
          &__original {
            @apply text-sm font-normal text-gray-500 line-through;
          }
        }
      }
      &__footer {
        @apply flex flex-row justify-between;
      }
    }
  }
}
</style>
