<template>
  <div v-if="variant !== null" class="product-detail">
    <div class="product-detail__header">
      <!-- @slot Breadcrumbs content -->
      <slot name="breadcrumbs">
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
    <div class="product-detail__tag">
      <slot name="tags">
        <product-tags v-if="variant" :product="variant" />
      </slot>
    </div>
    <div class="product-detail__image">
      <!-- @slot Image content -->
      <slot name="image">
        <image-list :images="variant.images || []" :slider="true" />
      </slot>
    </div>
    <div class="product-detail__content">
      <div class="content">
        <div class="content__header">
          <!-- @slot Header content -->
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
          <!-- @slot Ref content -->
          <slot name="ref">
            {{ variant.sku }}
          </slot>
        </div>
        <div class="content__shortDescription">
          <!-- @slot Intro content -->
          <slot name="intro">
            <div
              v-if="variant.shortDescription"
              v-html="variant.shortDescription"
            ></div>
          </slot>
        </div>
        <div class="content__variants">
          <!-- @slot Variants content -->
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
        <div class="content__stock">
          <!-- @slot Sxtock content -->
          <slot name="stock">
            <product-stock v-if="variant.stock !== null" :stock="variant.stock">
            </product-stock>
          </slot>
        </div>
        <div class="content__price">
          <!-- @slot Price content -->
          <slot name="price">
            <product-price
              v-if="variant.price !== null"
              :price="variant.price"
              class="py-4 text-right"
            >
              <template #price>
                <slot name="price" :price="variant.price"></slot>
              </template>
            </product-price>
          </slot>
          <!-- @slot Price content -->
          <slot name="add-to-cart">
            <client-only>
              <product-cart
                v-if="variant !== null"
                :product="variant"
              ></product-cart>
            </client-only>
          </slot>
        </div>
      </div>
    </div>
    <div class="product-detail__description">
      <!-- @slot Description content -->
      <slot name="description">
        <div
          v-html="variant.description"
          class="prose prose-sm max-w-none"
        ></div>
      </slot>
    </div>
    <div class="product-detail__links">
      <!-- @slot Links content -->
      <slot name="links">
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
      </slot>
    </div>
    <div class="product-detail__history">
      <!-- @slot History content -->
      <slot name="history">
        <client-only>
          <product-history :excluded-id="ids"></product-history>
        </client-only>
      </slot>
    </div>
  </div>
  <json-viewer :data="variant"></json-viewer>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { Product } from '~~/models/Product'
import ProductPriceVue from '~/components/product/ProductPrice.vue'
import ProductStock from '~/components/product/ProductStock.vue'
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
    'product-history': ProductHistory,
    'product-stock': ProductStock
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
  @apply flex flex-wrap p-3 max-md:flex-col md:p-5 relative;
  &__tag {
    @apply absolute left-10 top-16;
  }
  &__header {
    @apply w-full flex-grow;
  }
  &__image {
    @apply w-full px-3 md:w-1/2 lg:w-3/5;
  }
  &__content {
    @apply w-full pt-5 md:w-1/2 md:px-2 lg:w-2/5;
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
  &__description {
    @apply w-full py-4;
  }
  &__history {
    @apply py-4;
  }
}
</style>
