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
        <template v-for="(item, index) in items">
          <slot name="product" :product="item">
            <product-hit
              :key="item.id"
              :product="item"
              :inline="false"
              v-animate="{ name: 'searchProduct', index }"
            >
              <template #variants>
                <span></span>
              </template>
            </product-hit>
          </slot>
        </template>
      </div>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </search-base>
</template>
<script lang="ts" setup>
import esb from 'elastic-builder'

export interface SortItem {
  label: string
  value: string
  order?: string
}
defineProps({
  provider: {
    type: Function,
    required: true
  },
  query: {
    type: Function,
    required: false,
    default: () => {
      return esb.boolQuery().must(esb.matchAllQuery()).should(esb.termQuery('main', true))
    }
  },
  sortOptions: {
    type: Array as PropType<Array<SortItem>>,
    required: false,
    default: () => {
      return null
    }
  }
})
</script>
