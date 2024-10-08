<template>
  <div v-if="links.length > 0" class="product-links">
    <div class="product-links__head">
      <slot name="head"></slot>
    </div>
    <div class="product-links__items">
      <slot name="products" :products="productLinks">
        <div
          v-for="(product, index) in productLinks"
          :key="product?.id || 0"
          class="items__product"
          v-animate="{ name: 'productLinks', index }"
        >
          <product-hit :product="product" :inline="false">
            <template #actions>
              <span></span>
            </template>
          </product-hit>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import type { Product } from '#models'
import ProductHitVue from './ProductHit.vue'

export default defineNuxtComponent({
  components: {
    'product-hit': ProductHitVue
  },
  name: 'ProductLinks',
  props: {
    links: {
      type: Array<{ id: number }>,
      required: true
    }
  },
  data() {
    return {
      productLinks: [] as Product[],
      ids: [] as number[]
    }
  },
  async setup(props) {
    const ids: number[] = props?.links?.map((item) => item.id) || []
    return {
      ids
    }
  },
  async mounted() {
    const productService = useShopinvaderService('products')
    if (this.ids?.length > 0) {
      this.productLinks = (await productService?.getByIds(this.ids))?.hits || []
    }
  }
})
</script>

<style lang="scss">
.product-links {
  &__title {
    flex-grow: 1;
  }

  &__items {
    @apply grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5;
    .items__product {
      .product-hit {
        @apply card border bg-base-100;
      }
    }
  }
}
</style>
