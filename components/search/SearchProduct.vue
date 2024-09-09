<template>
  <search-base
    :size="30"
    :provider="provider"
    :query="query"
    :pagination="true"
    cardinality-field="url_key"
    :sort-options="
      sortOptions || [
        { label: $t('search.sort.relevance'), value: '_score', order: 'desc' },
        { label: $t('search.sort.name_asc'), value: 'name.sortable' },
        { label: $t('search.sort.name_desc'), value: 'name.sortable', order: 'desc' }
      ]
    "
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
          v-for="(item, index) in items"
          :key="item.id"
          :product="item"
          :inline="false"
          v-animate="{ name: 'searchProduct', index }"
        >
          <template #variants> </template>
        </ProductHit>
      </div>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </search-base>
</template>
<script lang="ts">
import { Product } from '#models'
import esb from 'elastic-builder'
import ProductHit from '~/components/product/ProductHit.vue'
import SearchBaseVue from '~~/components/search/SearchBase.vue'
import SearchSelectedFilters from '~~/components/search/SearchSelectedFilters.vue'
import SearchTermsAggregation from '~~/components/search/SearchTermsAggregation.vue'

export interface SortItem {
  label: string
  value: string
  order?: string
}
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
        return esb.boolQuery()
          .must(esb.matchAllQuery())
          .should(esb.termQuery('main', true))
      }
    },
    sortOptions: {
      type: Array as PropType<Array<SortItem>>,
      required: false,
      default: () => {
        return null
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
  setup() {
    const { t } = useI18n()
    const cartService = useShopinvaderService('cart')
    const cart = cartService.getCart()
    return {
      localePath,
      cart,
      $t: t
    }
  },
  methods: {
    transformResult(result: any) {
      const authService = useShopinvaderService('auth')
      let role: string | null = null
      const user = authService.getUser()
      if (user && user.value && user.value?.role) {
        role = user.value.role
      }
      return result?.hits?.hits?.map((data: any) => new Product(data._source, role || undefined))
    },
    motion(index: number) {
      const { animations } = useAppConfig() as any
      if (!animations) return false
      let motion = animations?.searchProduct || false
      if (typeof motion === 'function') {
        motion = motion(index)
      }
      return motion || false
    }
  }
}
</script>
