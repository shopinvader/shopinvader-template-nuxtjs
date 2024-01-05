<template>
  <div
    class="product-hit"
    :class="{
      'product-hit--inline': inline,
      'product-hit--loading': !variant
    }"
  >
    <slot name="header"></slot>
    <div class="product-hit__tag">
      <slot name="tags">
        <product-tags v-if="variant" :product="variant" />
      </slot>
    </div>
    <div class="product-hit__image">
      <slot name="images" :images="variant?.images || null">
        <product-image
          v-if="variant?.images && variant.images.length > 0"
          :image="variant.images[0]"
          @click="linkToProduct()"
        >
        </product-image>
        <div v-else class="noimage" @click="linkToProduct()"></div>
      </slot>
    </div>
    <div class="product-hit__body">
      <slot name="body" :product="variant">
        <div class="body__title">
          <slot name="title" :product="variant">
            <nuxt-link v-if="linkPath" :to="linkPath">
              {{ variant?.model?.name || variant?.name }}
            </nuxt-link>
          </slot>
        </div>
        <div class="body__variants">
          <slot name="variants" :variants="variants">
            <product-variants
              v-if="variants && variants?.length > 1 && variants?.length < 8"
              :variants="variants"
              @select-variant="changeVariant"
            />
          </slot>
        </div>
        <div class="body__desc">
          <slot name="desc" :product="variant"></slot>
        </div>
        <div class="body__stock">
          <slot name="product-stock">
            <product-stock v-if="variant?.stock !== null" :stock="variant?.stock">
            </product-stock>
          </slot>
        </div>
        <div class="body__price">
          <product-price v-if="price !== null" :price="price">
            <template #price>
              <slot name="price" :price="price"></slot>
            </template>
          </product-price>
        </div>

        <div v-if="!readonly" class="body__actions">
          <slot name="actions" :product="variant"> </slot>
        </div>
      </slot>
    </div>
    <div class="product-hit__footer">
      <slot name="footer" :product="variant"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import { Product, ProductPrice } from '#models'
import ProductPriceVue from '~/components/product/ProductPrice.vue'
import ProductImage from '~/components/product/ProductImage.vue'
import ProductVariants from '~/components/product/ProductVariants.vue'

export default {
  name: 'ProductHit',
  components: {
    'product-price': ProductPriceVue,
    'product-image': ProductImage,
    'product-variants': ProductVariants
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: false
    },
    inline: {
      type: Boolean,
      required: false,
      default: false

    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {
    const localePath = useLocalePath()
    return {
      localePath
    }
  },
  data() {
    return {
      variant: this.product as Product | null || null
    }
  },
  computed: {
    variants() {
      return this.product?.variants || []
    },
    linkPath() {
      const urlKey = this.product?.urlKey || null
      const sku = this.product?.sku || null
      if(sku && urlKey) {
        // console.log("test dora 2")
        const localePath = useLocalePath()
        return localePath({
          path: '/' + urlKey,
          query: { sku }
        })
      }
      return null
    },
    price():ProductPrice | null {
      const authService = useShopinvaderService('auth')
      const user = authService.getUser()
      const role = user?.value?.role as string || null
      let price = this.variant?.pricesList?.['default'] || this.variant?.price || null
      if(role !== null && this.variant?.pricesList?.[role]) {
        price = this.variant?.pricesList?.[role]
      }
      return price
    }
  },
  watch: {
    product(product: Product, oldProduct: Product) {
      if (product !== null) {
        this.variant = product
      } else if (oldProduct !== null && product == null) {
        this.variant = null
      }
    }
  },

  methods: {
    linkToProduct() {
      const $route = useRoute()
      const path = this.linkPath || null
      if(path) {
        this.$router.push({
          path,
          query: { sku: this.variant?.sku }
        })
        if (path == $route.fullPath) {
          // hack to force route update to rerender page without reload
          this.$router.push({
            path: $route.fullPath,
            query: { sku: this.variant?.sku + '?update'}
          })
        }
      }
    },
    changeVariant(variant: Product) {
      this.variant = variant
    }
  }
}
</script>
<style lang="scss">
.product-hit {
  @apply card flex h-full flex-col border-b p-2 duration-300 ease-in hover:z-10 hover:rounded-md hover:shadow-xl lg:p-3 relative;
  align-self: flex-end;
  flex-direction: column;
  align-items: stretch;
  &__tag {
    @apply absolute top-2 left-1 z-10;
  }
  &__image {
    @apply aspect-square relative max-h-full cursor-pointer overflow-hidden;
    .product-image {
      @apply h-full w-full rounded-md py-2;
    }
    .noimage {
      @apply h-full w-full rounded-md bg-slate-50;
    }
  }

  &__body {
    @apply card-body grow px-0 py-2 text-sm;

    .body__title {
      @apply line-clamp-2 font-bold;
      flex-grow: 1;
      cursor: pointer;
    }
    .body__body {
      flex-grow: 1;
      cursor: pointer;
    }
    .body__actions {
      @apply card-actions pt-2;
      .product-cart {
        &__add {
          @apply btn-circle;
          .add-label {
            @apply hidden;
          }
        }
      }
      .cart-line-qty {
        @apply w-40 bg-primary;
        .cartline-qty {
          &__btn {
            @apply bg-inherit text-white;

            &:hover {
              @apply border-primary bg-secondary;
            }
          }
          &__input {
            @apply border-0 bg-inherit text-white;
          }
        }
      }
    }
    .body__price {
      @apply text-right;
    }
    .body__variants {
      .variants {
        @apply py-0;
        &__hit {
          @apply h-10 w-10 p-1;
          .hit__image {
            @apply p-1;
          }
          .hit__title {
            @apply hidden;
          }
        }
      }
    }
  }
  &--inline {
    flex-direction: row;
    .product-hit__image {
      @apply w-1/5 md:w-1/6;
    }
    .product-hit__body {
      @apply flex flex-col flex-wrap justify-between md:flex-row;
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
  &--loading {
    .product-hit {
      &__image {
        .noimage {
          @apply animate-pulse bg-gray-200 rounded-lg cursor-default;
        }
      }
      &__body {
        .body {
          &__title {
            @apply animate-pulse bg-gray-200 rounded-lg cursor-default h-3 w-2/3;
          }
          &__desc {
            @apply animate-pulse bg-gray-200 rounded-lg cursor-default h-3 w-full;
          }
          &__price {
            @apply animate-pulse bg-gray-200 rounded-lg cursor-default h-3 w-1/3 items-end;
          }
        }
      }
    }
  }
}
</style>
