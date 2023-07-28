<template>
  <div
    v-if="variant !== null"
    class="product-hit"
    :class="{ 'product-hit--inline': inline }"
  >
    <slot name="header"></slot>
    <div class="product-hit__tag">
      <slot name="tags">
        <product-tags v-if="variant" :product="variant" />
      </slot>
    </div>
    <div class="product-hit__image">
      <slot name="images" :images="variant.images">
        <product-image
          v-if="variant.images && variant.images.length > 0"
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
            <nuxt-link :to="linkPath">
              {{ variant?.model?.name }}
            </nuxt-link>
          </slot>
        </div>
        <div class="body__variants">
          <product-variants
            v-if="variants && variants?.length > 1 && variants?.length < 8"
            :variants="variants"
            @select-variant="changeVariant"
          />
        </div>
        <div class="body__desc">
          <slot name="desc" :product="variant"></slot>
        </div>
        <div class="body__stock">
          <slot name="product-stock">
            <product-stock v-if="variant.stock !== null" :stock="variant?.stock">
            </product-stock>
          </slot>
        </div>
        <div class="body__price">
          <product-price v-if="variant.price !== null" :price="variant.price">
            <template #price>
              <slot name="price" :price="variant.price"></slot>
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
import { PropType } from 'vue'
import { Product } from '~~/models/Product'
import ProductPrice from '~/components/product/ProductPrice.vue'
import ProductImage from '~/components/product/ProductImage.vue'
import ProductVariants from '~/components/product/ProductVariants.vue'

export default {
  name: 'ProductHit',
  components: {
    'product-price': ProductPrice,
    'product-image': ProductImage,
    'product-variants': ProductVariants
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
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
      variant: this.product as Product | null
    }
  },
  computed: {
    variants() {
      return this.product.variants
    },
    linkPath() {
      const localePath = useLocalePath()
      return localePath({
        path: '/' + this.product.urlKey,
        query: { sku: this.variant?.sku }
      })
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
      this.$router.push({
        path: this.linkPath
      })
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
}
</style>
