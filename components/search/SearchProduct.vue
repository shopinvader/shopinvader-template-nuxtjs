<template>
  <search-base
    :size="30"
    :provider="provider"
    :query="query"
    :pagination="true"
    cardinality-field="url_key"
    :sort-options="[
      { label: 'Relevance', value: '_score' },
      { label: 'Name', value: 'name' }
    ]"
  >
    <template #filters>
      <slot name="filters">
        <search-product-filters></search-product-filters>
      </slot>
    </template>
    <template #header>
      <div class="pt-4">
        <slot name="header"></slot>
      </div>
      <search-selected-filters></search-selected-filters>
    </template>
    <template #items="{ items }">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        <ProductHit
          v-for="item in items"
          :key="item.id"
          :product="item"
          :inline="false"
        >
          <template #variants>
            {{ new Date().toLocaleTimeString() }}
          </template>
        </ProductHit>
      </div>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </search-base>
</template>
<script lang="ts">
import ProductHit from '~/components/product/ProductHit.vue'
import { Product } from '~/models/Product'
import SearchSelectedFilters from '~~/components/search/SearchSelectedFilters.vue'
import SearchBaseVue from '~~/components/search/SearchBase.vue'
import SearchTermsAggregation from '~~/components/search/SearchTermsAggregation.vue'
import esb from 'elastic-builder'

export default {
  components: {
    ProductHit,
    'search-base': SearchBaseVue,
    'search-terms-aggregation': SearchTermsAggregation,
    'search-selected-filters': SearchSelectedFilters
  },
  layout: 'default',
  props: {
    provider: {
      type: Function,
      required: true
    },
    query: {
      type: Function,
      required: false,
      default: () => {
        return esb.matchAllQuery()
      }
    }
  },
  data() {
    return {
      layout: 'grid',
      facets: {
        name: [],
        url: []
      }
    }
  },
  methods: {
    transformResult(result: any) {
      return result?.hits?.hits?.map((data: any) => new Product(data._source))
    }
  }
}
</script>
