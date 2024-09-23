<template>
  <div
    class="product-hit"
    :class="{
      'product-hit--inline': inline,
      'product-hit--loading': !variant,
      [props.cssClass]: true
    }"
  >
    <slot name="header"></slot>
    <div class="product-hit__tag">
      <slot name="tags" :product="variant">
        <product-tags v-if="variant" :product="variant" />
      </slot>
    </div>
    <div class="product-hit__image">
      <slot name="images" :product="variant" :images="variant?.images || null">
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
            <div v-if="variant?.variantCount && variant?.variantCount > 1">
              {{ $t('product.variants.count', { count: variant?.variantCount }) }}
            </div>
          </slot>
        </div>
        <div class="body__desc">
          <slot name="desc" :product="variant"></slot>
        </div>
        <div class="body__stock">
          <slot name="product-stock" :product="variant">
            <product-stock v-if="variant && variant?.stock !== null" :stock="variant?.stock">
            </product-stock>
          </slot>
        </div>
        <div class="body__price">
          <slot name="price" :product="variant" :price="price">
            <product-price v-if="price !== null" :price="price"> </product-price>
          </slot>
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
<script lang="ts" setup>
import type { Product, ProductPrice } from '#models'
import type { PropType } from 'vue'
const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: false,
    default: null
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
  },
  cssClass: {
    type: String,
    default: ''
  }
})
const localePath = useLocalePath()
const authService = useShopinvaderService('auth')
const router = useRouter()

const variant = ref((props.product as Product | null) || null) as Ref<Product | null>
const variants = computed(() => variant.value?.variants || [])
const linkPath = computed(() => {
  const urlKey = props.product?.urlKey || null
  const sku = props.product?.sku || null
  if (urlKey) {
    return localePath({
      path: '/' + urlKey,
      query: { sku }
    })
  }
  return null
})

const price = computed(() => {
  const user = authService?.getUser()
  const role = (user?.value?.role as string) || null
  let price = variant?.value?.pricesList?.['default'] || variant?.value?.price || null
  if (role !== null && variant?.value?.pricesList?.[role]) {
    price = variant?.value?.pricesList?.[role]
  }
  return price
})

watch(
  () => props.product,
  (product: Product, oldProduct: Product) => {
    if (product !== null) {
      variant.value = product
    } else if (oldProduct !== null && product == null) {
      variant.value = null
    }
  }
)

const linkToProduct = () => {
  const path = linkPath.value || null
  if (path) {
    router.push({
      path,
      query: { sku: variant.value?.sku }
    })
  }
}
</script>
<style lang="scss">
.product-hit {
  @apply card card-bordered relative flex h-full flex-col p-2 duration-300 ease-in hover:rounded-md hover:shadow-xl lg:p-3;
  align-self: flex-end;
  flex-direction: column;
  align-items: stretch;
  &__tag {
    @apply absolute left-1 top-2 z-10;
  }
  &__image {
    @apply relative aspect-square max-h-full cursor-pointer overflow-hidden pb-2;
    .product-image {
      @apply h-full w-full rounded-md;
      img {
        @apply card h-full w-full object-contain transition-transform hover:scale-125;
      }
    }
    .noimage {
      @apply card h-full w-full bg-slate-100;
    }
  }

  &__body {
    @apply card-body grow px-0 py-2 text-sm;

    .body__title {
      @apply line-clamp-2;
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
      .product-price {
        @apply justify-start;
        &__value {
          @apply text-lg font-bold;
        }
      }
      @apply text-right;
    }
    .body__variants {
      @apply text-xs text-gray-600;
    }
  }
  &--inline {
    flex-direction: row;
    .product-hit__image {
      @apply w-1/5 md:w-1/6;
    }
    .product-hit__body {
      @apply flex flex-col flex-wrap justify-between pl-6 md:flex-row;
      .body__title {
        @apply md:order-1 md:w-1/3;
      }
      .body__desc {
        @apply md:order-3 md:w-2/3;
      }
      .body__price {
        @apply md:order-2 md:w-1/3 md:border-l md:p-3;
        .product-price {
          @apply justify-end;
        }
      }
      .body__actions {
        @apply md:order-5 md:w-1/3 md:p-3;
      }
      .body__stock {
        @apply md:order-4 md:w-2/3;
      }
    }
  }
  &--loading {
    .product-hit {
      &__image {
        .noimage {
          @apply animate-pulse cursor-default rounded-lg bg-gray-200;
        }
      }
      &__body {
        .body {
          &__title {
            @apply h-3 w-2/3 animate-pulse cursor-default rounded-lg bg-gray-200;
          }
          &__desc {
            @apply h-3 w-full animate-pulse cursor-default rounded-lg bg-gray-200;
          }
          &__price {
            @apply h-3 w-1/3 animate-pulse cursor-default items-end rounded-lg bg-gray-200;
          }
        }
      }
    }
  }
}
</style>
