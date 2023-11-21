<template>
  <div class="flex gap-2 py-4">
    <button
      v-for="filter in activeFilters"
      :key="filter.name"
      class="btn-outline btn-primary btn-xs btn"
      @click="filter?.setValues([])"
    >
      <slot :filter="filter" :clear-filter="clearFilter">
        <span class="text-xs pr-2">
          {{ filter.title }}: {{ filter.getValuesLabels() }}
        </span>
        <span>
          <icon icon="material-symbols:close" />
        </span>
      </slot>
    </button>
  </div>
</template>
<script lang="ts">
import { type Filter } from './SearchBase.vue'
export default {
  name: 'SearchSelectedFilters',
  setup() {
    const filters: Filter[] = inject('filters') || []
    return {
      filters
    }
  },
  computed: {
    activeFilters(): Filter[] {
      return this.filters.filter(
        (filter: Filter) => filter?.getValuesLabels() !== ''
      )
    }
  },
  methods: {
    clearFilter(filter: Filter) {
      const clearFilter: ((filter: Filter) => void) | null =
        inject('clearFilter') || null
      if (clearFilter !== null) {
        clearFilter(filter)
      }
    }
  }
}
</script>
