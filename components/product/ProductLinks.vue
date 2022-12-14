<template>
  <div v-if="links.length > 0" class="product-links">
    <div class="product-links__title">
      <slot name="head"></slot>
    </div>
    <div class="product-links__items">
      <product-hit v-for="prod in productLinks" :product="prod" :inline="false" class="items__product">
        <template #actions>
          <span></span>
        </template>
      </product-hit>
    </div>
  </div>
</template>

<script lang="ts">
import { Product } from '~~/models';
import { linkId } from '~~/models/ProductLinks';
import ProductHitVue from './ProductHit.vue';
export default {
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
  data ()
  {
    return {
      productLinks: null as Product[] | null
    };
  },
  methods: {
    async getProducts ()
    {
      const service = useShopinvaderServices()?.products;
      this.productLinks = (await service?.getByIds(this.links.map(item => item.id)))?.hits || null;
    }
  },
  async mounted ()
  {
    await this.getProducts();
  }
};
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
      @apply w-full md:w-1/3 lg:w-1/4;
    }
  }

}
</style>