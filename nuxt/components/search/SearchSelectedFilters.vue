<template>
  <div class="flex gap-2 py-4">
    <button
      v-for="filter in activeFilters"
      :key="filter.name"
      class="bg-base btn-ghost btn-sm btn gap-2 bg-gray-100 text-xs"
      @click="filter?.setValues([])"
    >
      <slot :filter="filter" :clear-filter="clearFilter">
        {{ filter.title }}: <b>{{ filter.getValuesLabels() }}</b>
        <icon icon="ph:x" />
      </slot>
    </button>
  </div>
</template>
<script lang="ts">
import { Filter } from './SearchBase.vue'
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
