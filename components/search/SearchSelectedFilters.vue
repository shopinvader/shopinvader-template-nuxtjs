<template>
  <div class="searchSelectedFilters" v-if="activeFilters.length > 0">
    <button
      v-for="filter in activeFilters"
      :key="filter.name"
      class="searchSelectedFilters-button"
      @click="filter?.setValues([])"
    >
      <slot :filter="filter" :clear-filter="clearFilter">
        <span class="pr-2 text-xs"> {{ filter.title }}: {{ filter.getValuesLabels() }} </span>
        <span>
          <icon name="close" />
        </span>
      </slot>
    </button>
  </div>
</template>
<script lang="ts">
import type { Filter } from './SearchBase.vue'
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
      return this.filters.filter((filter: Filter) => filter?.getValuesLabels() !== '')
    }
  },
  methods: {
    clearFilter(filter: Filter) {
      const clearFilter: ((filter: Filter) => void) | null = inject('clearFilter') || null
      if (clearFilter !== null) {
        clearFilter(filter)
      }
    }
  }
}
</script>
<style>
@reference "@/assets/css/main.css";

.searchSelectedFilters {
  @apply flex flex-wrap gap-2 px-6 py-4;
  &-button {
    @apply btn btn-outline btn-primary btn-xs pl-4;
  }
}
</style>
