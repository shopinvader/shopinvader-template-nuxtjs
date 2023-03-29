<template>
  <search-base
    :key="instanceKey"
    :size="30"
    :provider="providerFunction"
    :query="query"
  >
    <template #filters> </template>
    <template #header>
      <search-selected-filters></search-selected-filters>
    </template>
    <template #items="{ items }">
      <div class="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3">
        <ProductHit
          v-for="item in items"
          :key="item.id"
          :product="item"
          :inline="false"
        >
        </ProductHit>
      </div>
    </template>
  </search-base>
</template>
<script lang="ts">
import ProductHit from '~/components/product/ProductHit.vue'
import { Product } from '~/models/Product'
import { ProductService } from '~/services/ProductService'
import SearchSelectedFilters from '~~/components/search/SearchSelectedFilters.vue'
import SearchBaseVue from '~~/components/search/SearchBase.vue'
import esb, { BoolQuery, TermQuery } from 'elastic-builder'

export default {
  components: {
    ProductHit,
    'search-base': SearchBaseVue,
    'search-selected-filters': SearchSelectedFilters
  },
  layout: 'default',
  setup() {
    const $route = useRoute()
    const instanceKey = ref(0)
    watch($route, () => {
      instanceKey.value++
    })
    return {
      instanceKey
    }
  },
  data() {
    return {
      layout: 'grid',
      queryFunction: null,
      facets: {
        name: [],
        url: []
      }
    }
  },

  methods: {
    transformResult(result: any) {
      return result?.hits?.hits?.map((data: any) => new Product(data._source))
    },
    async providerFunction(body: any) {
      const services = useShopinvaderServices()
      return (await services?.products?.search(body)) || null
    },
    categoryQuery(query: BoolQuery) {
      if (query !== null) {
        query.must(new TermQuery('categories.level', '0'))
      } else {
        query = new BoolQuery().must(new TermQuery('categories.level', '0'))
      }

      return query
    },
    query() {
      const route = useRoute()
      const query: string | null = route.query?.q || null
      if (query !== null) {
        return ProductService.fullTextQuery(query)
      } else {
        return esb.matchAllQuery()
      }
    }
  }
}
</script>
