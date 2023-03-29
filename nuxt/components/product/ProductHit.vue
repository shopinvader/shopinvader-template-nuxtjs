<template>
  <div
    v-if="product !== null"
    class="product-hit"
    :class="{ 'product-hit--inline': inline }"
  >
    <slot name="header"></slot>
    <slot name="images" :images="product.images">
      <product-image
        v-if="product.images && product.images.length > 0"
        :image="product.images[0]"
        class="product-hit__image"
        @click="linkToProduct()"
      >
      </product-image>
      <div v-else class="product-hit__noimage"></div>
    </slot>
    <div class="product-hit__body">
      <slot name="body" :product="product">
        <div class="body__title">
          <slot name="title" :product="product">
            <nuxt-link :to="localePath({ path: '/' + product.urlKey })">
              {{ product.name }}
            </nuxt-link>
          </slot>
        </div>
        <div class="body__desc">
          <slot name="desc" :product="product"></slot>
        </div>
        <div class="body__price">
          <product-price v-if="product.price !== null" :price="product.price">
            <template #price>
              <slot name="price" :price="product.price"></slot>
            </template>
          </product-price>
        </div>
        <div v-if="!readonly" class="body__actions">
          <slot name="actions" :product="product">
            <product-cart :product="product">
              <template #cart>
                <slot name="cart" :product="product"></slot>
              </template>
            </product-cart>
          </slot>
        </div>
      </slot>
    </div>
    <div class="product-hit__footer">
      <slot name="footer" :product="product"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { Product } from '~~/models/Product'
import ProductPrice from '~/components/product/ProductPrice.vue'
import ProductImage from '~/components/product/ProductImage.vue'
import ProductCart from '~/components/product/ProductCart.vue'

export default {
  name: 'ProductHit',
  components: {
    'product-price': ProductPrice,
    'product-image': ProductImage,
    'product-cart': ProductCart
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    },
    inline: {
      type: Boolean,
      required: true
    },
    readonly: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    linkToProduct() {
      this.$router.push({
        path: '/' + this.product.urlKey
      })
    }
  }
}
</script>
<style lang="scss">
.product-hit {
  @apply card;
  display: flex;
  align-self: flex-end;
  flex-direction: column;
  align-items: stretch;
  position: inherit;
  &__image {
    cursor: pointer;
  }
  &__noimage {
    @apply rounded bg-slate-50;
    content: '';
    padding-bottom: 70%;
    width: 100%;
  }
  &__body {
    @apply card-body px-0 py-2 text-sm  md:p-3 md:text-base;

    .body__title {
      @apply font-bold line-clamp-2;
      flex-grow: 1;
      cursor: pointer;
    }
    .body__body {
      flex-grow: 1;
      cursor: pointer;
    }
    .body__actions {
      @apply card-actions pt-2;
    }
    .body__price {
      @apply text-right;
    }
  }
  &--inline {
    flex-direction: row;
    .product-hit__image {
      @apply w-1/5 md:w-1/6;
    }
    .product-hit__body {
      @apply flex flex-col md:flex-row;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0;
      .body__title {
        @apply md:order-1 md:w-1/3;
      }
      .body__desc {
        @apply md:order-3 md:w-2/3;
      }
      .body__price {
        @apply text-right md:order-2 md:w-1/3 md:border-l md:p-3;
      }
      .body__actions {
        @apply md:order-4 md:w-1/3 md:border-l md:p-3;
      }
    }
  }
}
</style>
