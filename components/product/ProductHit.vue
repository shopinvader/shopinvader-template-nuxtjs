<template>
  <div v-if="product !== null" 
    class="product-hit"
    :class="{'product-hit--inline': inline}"
  >
    <slot name="header"></slot>
    <slot name="images"
      v-bind:images="product.images">
      <product-image
        v-if="product.images.length > 0"
        :image="product.images[0]"
        class="product-hit__image"
        @click="linkToProduct()"
      >
      </product-image>
    </slot>
    <div class="product-hit__body">
      <slot name="body" v-bind:product="product">
        <div class="body__title">
          <slot name="title" v-bind:product="product">
            <nuxt-link :to="localePath({ path: '/'+product.urlKey })">
              {{ product.name }}
            </nuxt-link>
          </slot>
        </div>
        <div class="body__desc">
          <slot name="desc" v-bind:product="product">          
          </slot>
        </div>
        <div class="body__price">
          <product-price v-if="product.price !== null" :price="product.price">
            <template #price>
              <slot name="price" v-bind:price="product.price"></slot>
            </template>
          </product-price>
        </div>
        <div v-if="!readonly" class="body__actions">
          <slot name="actions" v-bind:product="product">
            <product-cart :product="product">
              <template #cart>
                <slot name="cart"
                  v-bind:product="product"
                >
                </slot>
              </template>
            </product-cart>
          </slot>
        </div>
      </slot>
    </div>
    <div class="product-hit__footer">
      <slot name="footer" v-bind:product="product"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { Product } from '~~/models/Product';
import ProductPrice from '~/components/product/ProductPrice.vue';
import ProductImage from '~/components/product/ProductImage.vue';
import ProductCart from '~/components/product/ProductCart.vue';
import ProductWhishlist from '~/components/product/ProductWhishlist.vue';
export default {
  name: 'ProductHit',
  components: {
    'product-price': ProductPrice,
    'product-image': ProductImage,
    'product-cart': ProductCart,
    'product-whishlist': ProductWhishlist
  },
  props: {
    product: {
      type:  Object as PropType<Product>,
      required: true
    },
    inline: {
      type:  Boolean,
      required: true
    },
    readonly: {
      type:  Boolean,
      required: false
    },
  },
  methods: {
    linkToProduct() {
      this.$router.push({
        path: '/' + this.product.urlKey
      });
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
  &__image {
    cursor: pointer;
  }
  &__body {
    @apply card-body px-0 py-2 md:p-3;
    
    .body__title {
      @apply font-bold;
      flex-grow: 1;
      cursor: pointer;
    }
    .body__body {
      flex-grow: 1;
      cursor: pointer;
    }
    .body__actions {
      @apply pt-2 card-actions;
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
        @apply md:w-1/3 md:order-1;
      }
      .body__desc {
        @apply md:w-2/3 md:order-3;
      }
      .body__price {
        @apply md:w-1/3 md:order-2 md:p-3 md:border-l text-right;
      }
      .body__actions {
        @apply md:w-1/3 md:order-4 md:p-3 md:border-l;
      }
    }
  }
}
</style>