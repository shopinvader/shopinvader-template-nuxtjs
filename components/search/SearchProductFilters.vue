<template>
  <div v-for="filter in filters" :key="filter.name">
    <component :is="filter.component" v-bind="filter"></component>
  </div>
</template>
<script lang="ts" setup>
const appConfig = useAppConfig()
interface FilterComponent {
  name: string;
  field: string;
  title: string;
  close: boolean;
  component: Component;
  urlParam: string;
}

const filters = ref<FilterComponent[]>([])
if (appConfig?.search?.filters) {
  filters.value = appConfig.search.filters.map((filter: any) => {
    let component: Component | string | null = null
    if (filter.type === 'range-price') {
      component = resolveComponent('SearchRangePrice')
    } else {
      component = resolveComponent('SearchTermsAggregation')
    }

    return {
      ...filter,
      close: filter.close || false,
      title: filter.title || $t(`filters.${filter.name}`),
      component
    }
  })
}
</script>
