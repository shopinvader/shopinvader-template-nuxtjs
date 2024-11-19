<template>
  <div v-for="filter in filters" :key="filter.name">
    <component :is="filter.component" v-bind="filter"></component>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  filters: {
    type: Array as PropType<FilterComponent[]>,
    required: false,
    default: () => []
  }
})
const { t } = useI18n()
const appConfig = useAppConfig()
// Use shallowref to avoid vuejs reactivity warning
const filters = shallowRef<FilterComponent[]>(props.filters)
if (appConfig?.search?.filters) {
  filters.value = appConfig.search.filters.map((filter: any) => {
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
