<template>
  <div v-if="variant !== null" class="product-detail">
    <div class="product-detail__header">
      <slot name="header">
        <div class="breadcrumbs text-sm">
          <ul>
            <li v-for="category in variant.categories" :key="category.id">
              <nuxt-link :to="localePath({ path: '/' + category.urlKey })">
                {{ category.name }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </slot>
    </div>
    <div class="product-detail__image">
      <slot name="image">
        <image-list :images="variant.images || []" :slider="false" />
      </slot>
    </div>
    <div class="product-detail__content">
      <div class="content">
        <div class="content__header">
          <slot name="header">
            <div class="header">
              <h1 class="header__title">
                {{ variant?.model?.name || variant?.name }}
              </h1>
              <p class="header__subtitle">
                {{ variant.shortName }}
              </p>
            </div>
          </slot>
        </div>
        <div class="content__ref">
          <slot name="ref">
            {{ variant.sku }}
          </slot>
        </div>
        <div class="content__shortDescription">
          <slot name="shortDescription">
            <div
              v-if="variant.shortDescription"
              v-html="variant.shortDescription"
            ></div>
          </slot>
        </div>
        <div class="content__variants">
          <slot name="variants">
            <product-variants-selector
              v-if="variant.variantSelector?.length > 1"
              :product="variant"
              @select-variant="changeVariant"
            />
            <product-variants
              v-else-if="variants !== null"
              :variants="variants"
              @select-variant="changeVariant"
            >
            </product-variants>
          </slot>
        </div>

        <product-price
          v-if="variant.price !== null"
          :price="variant.price"
          class="py-4 text-right"
        >
          <template #price>
            <slot name="price" :price="variant.price"></slot>
          </template>
        </product-price>
        <client-only>
          <product-cart
            v-if="variant !== null"
            :product="variant"
          ></product-cart>
        </client-only>
      </div>
    </div>
    <div>
      <div v-html="variant.description"></div>
      <product-links v-if="variant" :links="variant.links?.crossLink || []">
        <template #head>
          <h2 class="text-xl">{{ $t('product.cross_selling.title') }}</h2>
        </template>
      </product-links>
      <product-links v-if="variant" :links="variant?.links?.upLink || []">
        <template #head>
          <h2 class="text-xl">{{ $t('product.up_selling.title') }}</h2>
        </template>
      </product-links>
    </div>
    <div class="product-detail__history">
      <client-only>
        <product-history :excluded-id="ids"></product-history>
      </client-only>
    </div>
  </div>
  <json-viewer :data="variant"></json-viewer>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { Product } from '~~/models/Product'
import ProductPriceVue from '~/components/product/ProductPrice.vue'
import ProductVariants from '~~/components/product/ProductVariants.vue'
import ProductVariantsSelector from '~~/components/product/ProductVariantsSelector.vue'

import ProductCartVue from '~~/components/product/ProductCart.vue'
import JsonViewer from '~/components/debug/JsonViewer.vue'
import ProductLinksVue from './ProductLinks.vue'
import ImageListVue from './ImageList.vue'
import { useHistoryStore } from '~/stores/history'
import ProductHistory from './ProductHistory.vue'

export default {
  components: {
    'image-list': ImageListVue,
    'product-price': ProductPriceVue,
    'json-viewer': JsonViewer,
    'product-variants': ProductVariants,
    'product-variants-selector': ProductVariantsSelector,
    'product-cart': ProductCartVue,
    'product-links': ProductLinksVue,
    'product-history': ProductHistory
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  setup(props) {
    const localePath = useLocalePath()
    let variant = ref(props.product)
    useHistoryStore().addProduct(props.product)
    const changeVariant = (item: Product) => {
      item = {
        ...item,
        variants: props.product.variants
      }
      variant.value = item
    }
    return {
      variant,
      changeVariant,
      localePath
    }
  },
  computed: {
    variants() {
      return this.product?.variants || null
    },
    ids() {
      return [
        this.product?.id,
        ...(this.product?.variants || []).map((v) => v.id)
      ]
    }
  }
}
</script>
<style lang="scss">
.product-detail {
  @apply flex flex-wrap p-3 md:p-5;
  &__header {
    @apply w-full flex-grow;
  }
  &__image {
    @apply w-full px-3 sm:w-1/2 lg:w-3/5;
  }
  &__content {
    @apply w-full pt-5 sm:w-1/2 md:px-2 lg:w-2/5;
    .content {
      @apply sticky top-24;
      &__header {
        @apply mb-4 border-b;
        .header {
          @apply mb-2 w-full;
          &__title {
            @apply mb-0 text-3xl;
          }
          &__subtitle {
            @apply text-lg uppercase text-gray-400;
          }
        }
      }
      &__variants {
        .variants {
          @apply flex flex-wrap;
        }
      }
    }
    .variants {
      @apply flex flex-wrap;
      &__label {
        @apply w-1/2;
      }
      &__value {
        @apply w-1/2;
      }
    }
  }
  &__history {
    @apply py-4;
  }
}
</style>
