<template>
  <div v-for="filter in filtersWithComponents" :key="filter.name">
    <component :is="filter.component" v-bind="filter"></component>
  </div>
</template>
<script lang="ts" setup>
import type { SearchFilterComponent } from '#models'

const props = defineProps({
  filters: {
    type: Array as PropType<SearchFilterComponent[]>,
    required: false,
    default: () => {
      const appConfig = useAppConfig()
      return appConfig.search.filters || []
    }
  }
})
const { t } = useI18n()

// Use shallowref to avoid vuejs reactivity warning
const filtersWithComponents = shallowRef<SearchFilterComponent[]>([])
if (props?.filters) {
  filtersWithComponents.value = props.filters.map((filter: any) => {
    let component: Component | string | null = null
    if (filter.type === 'range-price') {
      component = resolveComponent('SearchRangePrice')
    } else if (filter.type === 'category') {
      component = resolveComponent('SearchProductCategoryFilter')
    } else {
      component = resolveComponent('SearchTermsAggregation')
    }
    let title = t(filter.title)
    if (title == filter.title) {
      title = t(`filters.${filter.name}`)
      if (title == `filters.${filter.name}`) {
        title = filter.title
      }
    }
    return {
      ...filter,
      close: filter.close || false,
      title,
      component
    }
  })
}
</script>
