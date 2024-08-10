<template>
  <search-base
    :size="30"
    :provider="provider"
    :query="query"
    :suggesters="suggesters"
    :pagination="true"
    cardinality-field="url_key"
    class="search-product"
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
    <template #action>
      <slot name="action"></slot>
      <div class="search-product__display">
        <button
          @click="displayMode = 'grid'"
          class="btn-grid btn"
          :class="{ 'btn--selected': displayMode == 'grid' }"
        >
          <icon name="product-grid"></icon>
          {{ $t('search.display_mode.grid') }}
        </button>
        <button
          @click="displayMode = 'list'"
          class="btn-list btn"
          :class="{ 'btn--selected': displayMode == 'list' }"
        >
          <icon name="product-list"></icon>
          {{ $t('search.display_mode.list') }}
        </button>
      </div>
    </template>
    <template #items="{ items }">
      <div
        class="search-product__results"
        :class="{
          'search-product__results--grid': displayMode === 'grid',
          'search-product__results--list': displayMode === 'list'
        }"
      >
        <template v-for="(item, index) in items">
          <slot name="product" :product="item">
            <product-hit
              :key="item.id"
              :product="item"
              :inline="displayMode == 'list'"
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
    <template #no-results="{ total, response }">
      <slot name="no-results" :total="total" :response="response"></slot>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </search-base>
</template>
<script lang="ts" setup>
import type { SearchSortItem } from '#models'
import { matchAllQuery } from 'elastic-builder'

const displayMode = ref('grid')

defineProps({
  provider: {
    type: Function,
    required: true
  },
  query: {
    type: Function,
    required: false,
    default: () => {
      return matchAllQuery()
    }
  },
  suggesters: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    type: Array<Function>,
    required: false,
    default: null
  },
  sortOptions: {
    type: Array as PropType<Array<SearchSortItem>>,
    required: false,
    default: () => {
      return null
    }
  }
})
</script>
<style lang="scss">
.search-product {
  &__results {
    &--grid {
      @apply grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3;
    }
    &--list {
      @apply grid grid-cols-1 gap-3;
    }
  }
  &__display {
    @apply flex flex-1 justify-end gap-2 px-3 max-md:order-first;
    button.btn {
      @apply btn-outline btn-sm rounded-md;
      &--selected {
        @apply border-primary;
      }
    }
  }
}
</style>
