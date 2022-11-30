<template>
  <div class="flex gap-2 py-4">
    <button v-for="filter in activeFilters" class="btn btn-outline btn-primary btn-xs" @click="filter?.setValues([])">
      <slot :filter="filter" :clearFilter="clearFilter">
        <span class="text-xs">{{ filter.title }}: {{ filter.getValuesLabels() }}</span>
        <span>X</span>
      </slot>
    </button>
  </div>
</template>
<script lang="ts">
import { Filter } from './SearchBase.vue';
export default({
  name: 'SearchSelectedFilters',
  computed: {
    activeFilters(): Filter[] {
      return this.filters.filter((filter: Filter) => filter.getValuesLabels() !== '');
    }
  },
  setup() {
    const filters:Filter[] = inject('filters')
    return {
      filters
    }
  },
  methods: {
    clearFilter(filter:Filter) {
      const clearFilter:Function = inject('clearFilter')
      clearFilter(filter)
    }
  }
})
</script>