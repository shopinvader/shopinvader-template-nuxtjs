<template>
  <div v-if="variant !== null" class="product-detail">
    <div class="product-detail__header">
      <slot name="header">
        <div class="text-sm breadcrumbs">
          <ul>
            <li v-for="category in variant.categories">
              <nuxt-link :to="localePath({ path: '/'+category.urlKey })">
                {{ category.name }}
              </nuxt-link>
            </li> 
          </ul>
        </div>
      </slot>
    </div>
    <div class="product-detail__image">
      <product-image
        v-if="variant.images.length > 0"
        :image="variant.images[0]"
      >
      </product-image>
    </div>
    <div class="product-detail__content">
      <h1 class="text-xl font-bold">
        {{ variant.name }}
      </h1>
      <div>
        {{ variant.sku }}
      </div>
      <p>
        {{ variant.shortDescription }}
      </p>
      <product-variants
        v-if="variants !== null"
        :variants="variants"
        @selectVariant="changeVariant"
      >
      </product-variants>
      <product-price
        :price="variant.price"
        class="py-4 text-right"
      >
        <template #price>
          <slot name="price" v-bind:price="variant.price"></slot>
        </template>
      </product-price>
      <client-only>
        <product-cart v-if="variant !== null" :product="variant"></product-cart>
      </client-only>
    </div>
    <div>
      <product-links v-if="variant" :links="variant.links?.crossLink || []">
        <template #head>
          <h1>{{$t('product.cross_selling.title')}}</h1>          
        </template>
      </product-links>
      <product-links v-if="variant" :links="variant?.links?.upLink || []">
        <template #head>
          <h1>{{$t('product.up_selling.title')}}</h1>          
        </template>
      </product-links>
    </div>
  </div>
  <json-viewer :data="variant"></json-viewer>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { ProductImage } from '~~/models/ProductImage'
import { Product } from '~~/models/Product'
import ProductPriceVue from '~/components/product/ProductPrice.vue'
import ProductImageVue from '~/components/product/ProductImage.vue'
import ProductVariants from '~~/components/product/ProductVariants.vue'
import ProductCartVue from '~~/components/product/ProductCart.vue'
import JsonViewer from '~/components/debug/JsonViewer.vue'
import ProductLinksVue from './ProductLinks.vue';

export default {
  components: {
    'product-image': ProductImageVue,
    'product-price': ProductPriceVue,
    'json-viewer': JsonViewer,
    'product-variants': ProductVariants,
    'product-cart': ProductCartVue,
    'product-links': ProductLinksVue
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  setup(props) {
    let variant = ref(props.product)
    const changeVariant = (item: Product) => {
      variant.value = item
    }
    return {
      variant,
      changeVariant
    }
  },
  computed: {
    variants () {
      return this.product?.variants || null
    }
  }
}
</script>
<style lang="scss">
  .product-detail {
    @apply p-5 flex flex-wrap;
    &__header {
      @apply w-full flex-grow;
    }
    &__image {
      @apply w-full sm:w-1/2 lg:w-1/3;
    }
    &__content {
      @apply w-full sm:w-1/2 lg:w-2/3 pt-5;
    }
  }
</style>