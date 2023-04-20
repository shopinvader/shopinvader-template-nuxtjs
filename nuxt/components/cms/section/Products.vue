<template>
  <div class="section-products">
    <div class="section-products__list">
      <product-hit
        v-for="product in products"
        :key="product.id"
        :product="product"
        :inline="false"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { Products } from '~~/models/cms/section/Products'
import ProductHit from '~~/components/product/ProductHit.vue'
export default {
  name: 'Hero',
  fetchKey: 'Hero',
  components: {
    'product-hit': ProductHit
  },
  props: {
    component: {
      type: Object as PropType<Products>,
      required: true
    }
  },
  async setup(props) {
    const component = props?.component || null
    const services = useShopinvaderServices()
    console.log(component.productsSKU)
    const result = await services?.products?.find(
      'sku',
      component.productsSKU.map((i) => i.SKU)
    )
    let products = result?.hits || []

    return {
      products
    }
  }
}
</script>
<style lang="scss">
.section-products {
  &__list {
    @apply grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3;
  }
}
</style>
