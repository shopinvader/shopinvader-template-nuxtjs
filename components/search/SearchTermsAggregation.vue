<template>
  <div
    v-if="data?.items?.length > 0"
    class="searchfilter"
    :class="{ 'searchfilter--opened': opened }"
  >
    <slot name="title" :title="title">
      <div class="searchfilter__header" @click="setToggle">
        <div class="header__title">{{ title }}</div>
        <div class="header__close">
          <icon :name="opened ? 'up' : 'down'" />
        </div>
      </div>
    </slot>
    <div class="content">
      <slot name="searchable" :items="data.items" :search="onTextSearch">
        <div
          v-if="searchable && opened && data?.items?.length > 0"
          class="searchfilter__searchable"
        >
          <input
            type="text"
            v-model="textSearchQuery"
            :placeholder="t('search.placeholder')"
            class="searchable__input"
          />
        </div>
      </slot>
      <slot name="items" :items="itemsWithSearch" :change="setValues">
        <div v-if="opened" class="searchfilter__items">
          <template v-for="item in itemsWithSearch" :key="item.key">
            <slot name="item" :item="item" :change="setValues">
              <label class="item" :class="{ 'item--active': selectedValues.includes(item.key) }">
                <input
                  v-model="selectedValues"
                  type="checkbox"
                  class="item__checkbox"
                  :value="item.key"
                />
                <span class="item__label" v-html="item?.label || item.key"></span>
                <span class="item__count">{{ item.doc_count }}</span>
              </label>
            </slot>
          </template>
        </div>
        <button
          v-if="opened && data?.total > size"
          class="btn btn-link btn-xs pt-3"
          @click="displayAll"
        >
          <span v-if="sizeQuery == size">{{ t('search.filters.all') }}</span>
          <span v-else>{{ t('search.filters.reduce') }}</span>
        </button>
      </slot>
      <slot name="footer" :items="data.items" :size="size" :total="data?.total"> </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Aggregation, Query } from 'elastic-builder'
import {
  CardinalityAggregation,
  FilterAggregation,
  MatchAllQuery,
  NestedAggregation,
  NestedQuery,
  TermsAggregation,
  TermsQuery,
  cardinalityAggregation
} from 'elastic-builder'
import { inject, reactive } from 'vue'
import isEqual from '~/utils/IsEqual'
import type { Filter } from './SearchBase.vue'
interface FacetItem {
  key: string
  label: string
  doc_count: number
}
const emit = defineEmits('toggle')
const props = defineProps({
  name: {
    type: String,
    required: true
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
  filterItems: {
    type: Function,
    required: false,
    default: null
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
    default: 10
  },
  searchable: {
    type: Boolean,
    required: false,
    default: false
  },
  urlParam: {
    type: String,
    required: false,
    default: null
  },
  alphabeticOrder: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const urlParam = props.urlParam || props.name
const textSearchQuery = ref<string>('')
const opened = ref(!props.close)
const sizeQuery = ref(props.size)
const data = reactive({
  selected: [] as string[],
  items: [] as FacetItem[],
  total: 0
})

const declareFilter: ((params: Filter) => void) | null = inject('declareFilter') || null
const response: (() => void) | null = inject('response') || null
const search: (() => void) | null = inject('search') || null
const getValuesLabels = () => {
  return selectedValues.value.join(', ')
}

const getFilterAggregation = (query: Query | null): FilterAggregation => {
  // Initialize the main aggregation with terms aggregation based on provided props
  let agg: TermsAggregation = new TermsAggregation(props.name, props.field).size(sizeQuery.value) // Set the size of the aggregation based on reactive sizeQuery value
  if (props.alphabeticOrder) {
    agg = agg.order('_key', 'asc') // Order the aggregation by term in ascending order
  }
  // If a transformQuery function is provided in props, apply it to modify the query
  if (props.transformQuery !== null) {
    query = props.transformQuery(query, props.name, props.field)
  }
  // If a cardinalityField is specified, add a cardinality aggregation to the main aggregation
  if (props.cardinalityField !== null) {
    agg.agg(cardinalityAggregation(props.name + '_cardinality', props.cardinalityField))
  }
  // Initialize the aggregations array with the main aggregation
  let aggs: Aggregation[] = [agg]
  // Create a cardinality aggregation to count unique values in the specified field
  const uniqueAgg = new CardinalityAggregation('unique', props.field)
  // If a nestedPath is specified, wrap the main and unique aggregations in a nested aggregation
  if (props.nestedPath) {
    aggs = [new NestedAggregation(props.name, props.nestedPath).aggs([agg, uniqueAgg])]
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
}

const selectedValues = computed({
  get: () => {
    try {
      return JSON.parse(route?.query?.[urlParam]?.toString() || '[]')
    } catch (e) {
      return []
    }
  },
  set: (values: string[]) => {
    data.selected = values
    if (urlParam) {
      if (values.length > 0) {
        router.push({
          query: {
            ...route.query,
            [urlParam]: JSON.stringify(values)
          }
        })
      } else {
        const query = { ...route.query }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete query[urlParam]
        router.push({ query })
      }
    }
  }
})
const getQueryAggregation = () => {
  let aggs: Query | null = null
  const values: string[] = JSON.parse(route?.query?.[urlParam]?.toString() || '[]')
  if (values?.length > 0) {
    aggs = new TermsQuery(props.field, values || [])
    if (props.nestedPath) {
      aggs = new NestedQuery().path(props.nestedPath).query(aggs)
    }
  }
  return aggs
}

const setValues = (values: any[]) => {
  selectedValues.value = values || []
}
if (declareFilter !== null) {
  declareFilter({
    name: props?.name || '',
    title: props.title,
    values: selectedValues.value,
    urlParam,
    setValues,
    getValuesLabels,
    getFilterAggregation,
    getQueryAggregation
  })
}
const setToggle = () => {
  opened.value = !opened.value
  emit('toggle', props.name)
}
const onTextSearch = (q: string) => {
  textSearchQuery.value = q
}

/**
 * Filter result according to textSearchQuery
 */
const itemsWithSearch = computed(() => {
  if (textSearchQuery.value !== '') {
    return data?.items?.filter((item) => {
      return item.key?.search(new RegExp(textSearchQuery.value.toLowerCase(), 'i')) > -1
    })
  }
  return data?.items
})

const displayAll = () => {
  if (sizeQuery.value == props.size) {
    sizeQuery.value = data.total
  } else {
    sizeQuery.value = props.size
  }
  if (search !== null) {
    search()
  }
}

watch(
  () => response,
  (response: any) => {
    const aggregations = response?.value?.aggregations || null
    if (aggregations) {
      const name = props.name
      let items = []
      let total = 0
      if (props.transformData !== null) {
        const data = props.transformData(aggregations)
        items = data?.items || []
      } else {
        let values = aggregations

        while (values !== null) {
          values = values?.[name] || null
          if (values?.unique) {
            total = values?.unique?.value
          }
          if (values?.buckets) {
            items = values?.buckets
            break
          }
        }
      }

      if (props.cardinalityField) {
        for (const item of items) {
          if (props.nestedPath) {
            item.doc_count = null
          } else {
            item.doc_count = item[props.name + '_cardinality']?.value || item.doc_count
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
  { deep: true }
)

watch(
  () => props.close,
  (val, old) => {
    if (val !== old) {
      opened.value = !val
    }
  }
)
</script>
<style>
@reference "@/assets/css/main.css";

.searchfilter {
  @apply card mb-3 bg-gray-50 p-5 hover:bg-gray-100;
  &__header {
    @apply mb-2 flex cursor-pointer flex-nowrap items-center justify-between;
    .header {
      &__title {
        @apply font-heading text-lg;
      }
    }
  }
  &__items {
    @apply mt-2 text-xs;
    .item {
      @apply flex cursor-pointer items-center;
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
  &__searchable {
    .searchable__input {
      @apply input input-xs  w-full rounded-sm;
    }
  }
}
</style>
