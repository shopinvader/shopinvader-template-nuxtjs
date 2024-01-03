<template>
  <search-base
    :size="30"
    :provider="provider"
    :query="query"
    :pagination="true"
    cardinality-field="url_key"
    :sort-options="sortOptions || [
      { label: $t('search.sort.relevance'), value: '_score', order: 'desc'  },
      { label: $t('search.sort.name_asc'), value: 'name.sortable' },
      { label: $t('search.sort.name_desc'), value: 'name.sortable', order: 'desc' }
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
      <reveal-items class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3" selector=".product-hit" :scroll="true">
        <product-hit
          v-for="item in items"
          :key="item.id"
          :product="item"
          :inline="false"
        >
          <template #variants>

          </template>
        </product-hit>
      </reveal-items>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </search-base>
</template>
<script lang="ts">
import { Product } from '#models'
import {
  ProductHit,
  SearchSelectedFilters,
  SearchBase,
  SearchTermsAggregation,
  RevealItems
 } from '#components'
import esb from 'elastic-builder'

export interface SortItem {
  label: string
  value: string
  order?: string
}
export default {
  components: {
    'product-hit': ProductHit,
    'search-base': SearchBase,
    'search-terms-aggregation': SearchTermsAggregation,
    'search-selected-filters': SearchSelectedFilters,
    'reveal-items': RevealItems
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
      if(user?.value && user?.value?.role) {
        role = authService.getUser()?.role as string
      }
      return result?.hits?.hits?.map((data: any) => new Product(data._source, role))
    }
  }
}
</script>
