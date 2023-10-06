<template>
  <search-product
    ref="searchProduct"
    :provider="providerFunction"
    :query="query"
  >
    <template #header>
      <div class="text-2xl font-heading">
        {{ $t('search.autocomplete.product', { query: queryString }) }}
      </div>
    </template>
  </search-product>
</template>
<script lang="ts">
import SearchProduct from '~/components/search/SearchProduct.vue'
import { Product } from '~/models/Product'
import esb, { BoolQuery, TermQuery } from 'elastic-builder'

export default {
  components: {
    'search-product': SearchProduct
  },
  layout: 'default',
  setup() {
    const { t } = useI18n()
    const $route = useRoute()
    const refresh = ref(false)
    const queryString = computed(() => $route.query.q)
    useSeoMeta({
      title: t('search.autocomplete.product', { query: queryString?.value || '' })
    })
    return {
      queryString,
      refresh
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
      const productService = useShopinvaderService('products')
      return (await productService?.search(body)) || null
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
        const productService = useShopinvaderService('products')
        return productService.fullTextQuery(query)
      } else {
        return esb.matchAllQuery()
      }
    }
  }
}
</script>
