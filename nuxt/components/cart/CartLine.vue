<template>
  <div
    class="cartline"
    :class="{ 'cartline--pending': hasPendingTransactions }"
  >
    <div class="cartline__image">
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
        <slot name="header" :line="line"></slot>
      </div>

      <div class="content__title">
        <slot name="title" :line="line">
          <template v-if="product">
            <nuxt-link
              class="title"
              :to="localePath({ path: '/' + product.urlKey })"
            >
              {{ product.model.name }}
            </nuxt-link>
            <div class="shortTitle">
              <div v-for="[key, value] in attributes" :key="key">
                {{ key }} {{ value }}
              </div>
            </div>
          </template>
        </slot>
      </div>

      <div class="content__qty">
        <slot name="qty" :line="line">
          <div class="label">
            {{ $t('cart.line.quantity') }}
          </div>
          <div class="value">
            <cart-line-qty :line="line"></cart-line-qty>
          </div>
        </slot>
      </div>
      <div class="content_body"></div>
      <div class="content__delete">
        <button
          type="button"
          class="btn-link btn-xs btn p-0 text-xs"
          :title="$t('cart.line.delete')"
          @click="deleteLine"
        >
          <Icon icon="ph:trash" class="text-xl" />
          {{ $t('cart.line.delete') }}
        </button>
      </div>

      <div class="content__price">
        <slot name="price" :line="line">
          <div class="label">
            {{ $t('cart.line.total') }}
          </div>
          <div class="value">
            <div
              v-if="line.amount.totalWithoutDiscount"
              class="price__original"
            >
              {{ $filter.currency(line.amount.totalWithoutDiscount) }}
            </div>
            <div class="price__value">
              {{ $filter.currency(line.amount.total) }}
            </div>
          </div>
        </slot>
      </div>
      <div class="content__footer">
        <slot name="footer" :line="line"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { CartLine } from '~/models'
import CartLineQtyVue from './CartLineQty.vue'
import ProductImageVue from '../product/ProductImage.vue'
export default {
  name: 'CartLine',
  components: {
    'product-image': ProductImageVue,
    'cart-line-qty': CartLineQtyVue
  },
  props: {
    line: {
      type: Object as PropType<CartLine>,
      required: true
    }
  },
  emits: ['deleteLine'],
  computed: {
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
    linkToProduct() {
      if (this.product) {
        this.$router.push({
          path: '/' + this.product?.urlKey
        })
      }
    },
    deleteLine() {
      const cartService = useShopinvaderServices()?.cart || null
      if (cartService !== null) {
        cartService.deleteItem(this.line.id)
      }
      this.$emit('deleteLine', this.line)
    }
  }
}
</script>

<style lang="scss">
.cartline {
  @apply mb-2 flex border p-3 max-md:flex-wrap;
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
        @apply col-span-3  cursor-pointer text-sm;
      }
      &__title {
        @apply col-span-4 leading-none md:col-span-3;
        .title {
          @apply flex-row text-sm font-bold uppercase md:line-clamp-1;
        }
        .shortTitle {
          @apply text-sm text-gray-500;
        }
      }
      &__body {
        @apply col-span-3;
      }
      &__qty {
        @apply flex flex-col text-sm md:row-span-2;
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
        @apply flex  flex-row justify-between gap-2 text-sm;
        .price {
          &__value {
            @apply pb-0 text-lg font-bold leading-4 text-secondary;
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
