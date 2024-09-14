<template>
  <div v-if="data?.items?.length > 0" class="searchfilter">
    <slot name="title" :title="title">
      <div class="searchfilter__header" @click="opened = !opened">
        <div class="header__title">{{ title }}</div>
        <div class="header__close">
          <icon :name="opened ? 'up' : 'down'" />
        </div>
      </div>
    </slot>
    <slot name="items" :items="data.items" :change="refreshSearch">
      <template v-if="opened">
        <search-product-category-items
          v-if="data?.items?.length > 0"
          :items="data.items"
          :selected-item="data.selected"
          @select="selectItem"
        />
      </template>
      <button
        v-if="opened && data?.total > size"
        class="btn btn-link btn-xs pt-3"
        @click="displayAll"
      >
        <span v-if="sizeQuery == size">{{ $t('search.filters.all') }}</span>
        <span v-else>{{ $t('search.filters.reduce') }}</span>
      </button>
    </slot>
    <slot name="footer" :items="data.items" :size="size" :total="data?.total"> </slot>
  </div>
</template>
<script lang="ts" setup>
import type { Aggregation, Query } from 'elastic-builder'
import {
  BoolQuery,
  CardinalityAggregation,
  FilterAggregation,
  MatchAllQuery,
  MatchPhrasePrefixQuery,
  NestedAggregation,
  NestedQuery,
  TermQuery,
  TermsAggregation
} from 'elastic-builder'
import { inject, reactive } from 'vue'
import isEqual from '~/utils/IsEqual'
import type { Filter } from './SearchBase.vue'

export interface FacetItem {
  key: string
  level: number
  children: FacetItem[]
  count: number | null
  parent?: FacetItem
  selected?: boolean
}
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  startLevel: {
    type: Number,
    required: false,
    default: 0
  },
  close: {
    type: Boolean,
    required: false,
    default: true
  },
  field: {
    type: String,
    required: true
  },
  nestedPath: {
    type: String,
    required: false,
    default: null
  },
  title: {
    type: String,
    required: true
  },
  cardinalityField: {
    type: String,
    required: false,
    default: null
  },
  transformQuery: {
    type: Function,
    required: false,
    default: null
  },
  transformItems: {
    type: Function,
    required: false,
    default: null
  },
  transformData: {
    type: Function,
    required: false,
    default: null
  },
  size: {
    type: Number,
    required: false,
    default: 100
  },
  urlParam: {
    type: String,
    required: false,
    default: null
  }
})
const router = useRouter()
const opened = ref(!props.close)
const sizeQuery = ref(props.size)
const data = reactive({
  level: 0, // The level of the selected category
  urlKey: '', // The URL key of the selected category
  selected: [] as FacetItem[], // The selected categories
  items: [] as FacetItem[], // The list of categories fetched from ElasticSearch
  total: 0 // The total number of categories
})

const declareFilter: ((params: Filter) => void) | null = inject('declareFilter') || null
const search: (() => void) | null = inject('search') || null
const response: (() => void) | null = inject('response') || null

/**
 * Get the labels of the selected values for the list of selected filters
 */
const getValuesLabels = () => {
  return data.selected.map((i) => i.key).join(' > ')
}

/**
 * get the aggregation ElasticSearch query
 * @param query
 */
const getFilterAggregation = (query: Query | null): FilterAggregation => {
  try {
    let aggs: Aggregation[] = []
    const baseLevel = props.startLevel
    const level = data?.selected?.length || 0
    for (let i = 0; i <= level; i++) {
      // Create a filter aggregation for each level of the category
      let filterQuery: Query = new TermQuery('categories.level', i + baseLevel)
      if (i > 0) {
        /** TODO : filter sublevel by parent */
        const parentKey = data.selected[i - 1]?.key
        filterQuery = new BoolQuery().must([
          filterQuery,
          new MatchPhrasePrefixQuery('categories.parent.name', parentKey)
        ])
      }
      aggs.push(
        new FilterAggregation(`lvl${i}`, filterQuery).aggregations([
          new TermsAggregation('items', props.field).order('_key', 'asc').size(sizeQuery.value)
        ])
      )
    }

    // If a transformQuery function is provided in props, apply it to modify the query
    if (props.transformQuery !== null) {
      query = props.transformQuery(query, props.name, props.field)
    }

    // Create a cardinality aggregation to count unique values in the specified field
    const uniqueAgg = new CardinalityAggregation('unique', props.field)
    // If a nestedPath is specified, wrap the main and unique aggregations in a nested aggregation
    if (props.nestedPath) {
      aggs = [new NestedAggregation(props.name, props.nestedPath).aggs([...aggs, uniqueAgg])]
    } else {
      // If no nestedPath is specified, simply add the unique aggregation to the aggregations array
      aggs.push(uniqueAgg)
    }
    // Wrap the aggregations in a filter aggregation that filters documents based on the provided query
    // or a match all query if no query is provided
    const filterAggregation = new FilterAggregation(
      props.name,
      query || new MatchAllQuery()
    ).aggregations(aggs)
    return filterAggregation
  } catch (e) {
    console.error(e)
  }
  return new FilterAggregation(props.name, new MatchAllQuery())
}

/**
 * Get the query ElasticSearch aggregation
 */
const getQueryAggregation = () => {
  let aggs: Query | null = null
  const selected = data?.selected || []
  try {
    if (selected?.length > 0) {
      aggs = new TermQuery(props.field, selected.at(-1)?.key)
      if (props.nestedPath) {
        aggs = new NestedQuery().path(props.nestedPath).query(aggs)
      }
    }
  } catch (e) {
    console.error(e)
  }
  return aggs
}

const selectItem = (value: FacetItem) => {
  const isSelected = data.selected[value.level]?.key == value.key
  data.selected = data.selected.slice(0, value.level)
  if (!isSelected) {
    data.selected[value.level] = value
  }
  refreshSearch()
}

const setValues = (values: any[]) => {
  data.selected = values || []
  refreshSearch()
}

if (declareFilter !== null) {
  declareFilter({
    name: props?.name || '',
    title: props.title,
    values: data?.selected,
    setValues: setValues,
    getValuesLabels,
    getFilterAggregation,
    getQueryAggregation
  })
}

/**
 * Refresh the search with the selected values and change URL query params
 */
const refreshSearch = () => {
  if (props.urlParam) {
    const $route = useRoute()
    if (data.selected.length > 0) {
      router.push({
        query: {
          ...$route.query,
          [props.urlParam]: JSON.stringify(data.selected)
        }
      })
    } else {
      const query = { ...$route.query }
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete query[props.urlParam]
      router.push({ query })
    }
  }
  if (search !== null) {
    search()
  }
}

/**
 * Display all items available in the aggregation
 */
const displayAll = () => {
  if (sizeQuery.value == props.size) {
    sizeQuery.value = data.total
  } else {
    sizeQuery.value = props.size
  }
  refreshSearch()
}

watch(
  () => router.currentRoute.value,
  (currentRoute) => {
    if (!import.meta.env.SSR && props.urlParam) {
      try {
        const query: string = (currentRoute.query?.[props.urlParam] as string) || '[]'
        const values: string[] = JSON.parse(query) || []
        const isEqualValues = isEqual(values.sort(), data.selected.sort())
        if (!isEqualValues) {
          setValues(values)
        }
      } catch (e) {
        const query = { ...currentRoute.query }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete query[props.urlParam]
        router.replace({ path: currentRoute.path, query })
      }
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => response,
  (res: any) => {
    const { aggregations } = res?.value || {}
    if (aggregations) {
      const { name } = props
      let items: FacetItem[] = []
      let total = 0
      if (props?.transformData !== null) {
        const data = props?.transformData(aggregations)
        items = data?.items || []
      } else {
        const values = aggregations?.[name]?.[name]
        total = values?.lvl0?.doc_count || 0
        let parent: FacetItem | null = null
        for (let level = 0; level <= data.selected?.length; level++) {
          const { buckets } = values?.[`lvl${level}`]?.items || []
          const children: FacetItem[] = []
          if (Array.isArray(buckets) && buckets.length > 0) {
            for (const bucket of buckets) {
              children.push({
                key: bucket.key,
                count: bucket.doc_count,
                level,
                selected: data.selected[level]?.key == bucket.key,
                children: []
              })
            }
            if (parent) {
              parent.children = children
            } else {
              items = children
            }
            parent = children.find((i) => i.selected) || null
          }
        }
      }
      if (props.cardinalityField) {
        for (const item of items) {
          if (props.nestedPath) {
            item.count = null
          } else {
            item.count = item?.[props.name + '_cardinality']?.value || item?.count || 0
          }
        }
      }

      if (props.transformItems !== null) {
        const transformedItems = props.transformItems(items)
        items = transformedItems?.items || items
      }
      data.items = items || []
      data.total = total || 0
    }
  },
  { immediate: true, deep: true }
)
</script>
<style lang="scss">
.searchfilter {
  @apply card mb-3 p-5 hover:bg-gray-100;
  &__header {
    @apply mb-2 flex cursor-pointer flex-nowrap items-center justify-between;
    .header {
      &__title {
        @apply font-heading text-lg;
      }
    }
  }
  .search-category-item {
    @apply mt-2 text-xs;
    .search-category-item {
      @apply ml-2;
    }
    .item {
      @apply flex cursor-pointer items-start gap-1;
      &--active {
        & > .item {
          @apply font-bold text-primary;
        }
      }
      &__checkbox {
        @apply mr-2;
      }
      &__label {
        @apply flex-1;
      }
      &__count {
        @apply text-gray-500;
      }
    }
  }
}
</style>
