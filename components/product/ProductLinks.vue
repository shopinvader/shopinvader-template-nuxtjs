<template>
  <div v-if="links.length > 0" class="product-links">
    <div class="product-links__title">
      <slot name="head"></slot>
    </div>
    <div class="product-links__items">
      <div v-for="product in productLinks" class="items__product">
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
import { linkId } from '~~/models/ProductLinks';
import ProductHitVue from './ProductHit.vue';

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
  async setup (props) {
    const service = useShopinvaderServices()?.products
    return {
      productLinks: (await service?.getByIds(props.links.map(item => item.id)))?.hits || null
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
    display: flex;
    flex-wrap: wrap;

    .items__product {
      @apply w-full md:w-1/3 lg:w-1/4 p-4;

      .product-hit {
        @apply card bg-base-100 shadow-xl
      }
    }
  }

}
</style>
