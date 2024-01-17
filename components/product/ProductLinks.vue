<template>
  <div v-if="links.length > 0" class="product-links">
    <div class="product-links__head">
      <slot name="head"></slot>
    </div>
    <div class="product-links__items">
      <div
        v-for="(product, index) in productLinks"
        :key="product?.id || 0"
        class="items__product"
        v-motion="motion(index)"
      >
        <product-hit :product="product" :inline="false">
          <template #actions>
            <span></span>
          </template>
        </product-hit>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Product } from '#models'
import type { linkId } from '#models'
import ProductHitVue from './ProductHit.vue'

export default defineNuxtComponent({
  components: {
    'product-hit': ProductHitVue
  },
  name: 'ProductLinks',
  props: {
    links: {
      type: Array<linkId>,
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
  },
  methods: {
    motion(index: number) {
      const { animations } = useAppConfig() as any
      if(!animations) return false
      let motion = animations?.productLinks || false
      if(typeof motion === 'function') {
        motion = motion(index)
      }
      return motion || false
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
    @apply grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5 gap-4;
    .items__product {
      .product-hit {
        @apply card bg-base-100 border;
      }
    }
  }
}
</style>
