<template>
  <div class="search">
    <!------------------------------------------------>
    <!-- Filters at left (as aside on small screen) -->
    <div class="search__filters" :class="{ 'search__filters--active': displayfilters }">
      <div class="filters__container">
        <!-- @slot to display all available filters. Please do fill it in your calling component! -->
        <slot name="filters"></slot>
      </div>
      <div class="filters__action">
        <!-- Displayed in small screen only to close the list of filters -->
        <button type="button" @click="doSetDisplayFilters(false)">
          {{ t('search.filter') }}
        </button>
      </div>
    </div>
    <!--------------------------------------------------->
    <!-- Results at right (fullscreen on small screen) -->
    <div class="search__results">
      <!-- @slot on top of the result part. Best place to display a title. -->
      <slot
        name="header"
        :do-change-page="changePage"
        :do-set-display-filters="doSetDisplayFilters"
      ></slot>
      <!-- @slot displaying results -->
      <slot name="results" :items="items" :total="total" :response="response">
        <template v-if="loading">
          <!-- @slot to display the loading animation -->
          <slot name="loading">
            <div class="search__loading">
              <search-loader></search-loader>
            </div>
          </slot>
        </template>
        <template v-else-if="items?.length > 0">
          <div class="search__header">
            <!-- @slot to display the button that toggle the aside menu with filters in small screen mode -->
            <slot
              name="display-filters"
              :sort="sort"
              :total="page.total"
              :from="page.from"
              :size="page.size"
              :items="items"
              :do-change-page="changePage"
              :do-set-display-filters="doSetDisplayFilters"
            >
              <div class="search__display-filters">
                <!-- Displayed in small screen only to show the list of filters as aside. -->
                <button type="button" @click="doSetDisplayFilters(true)">
                  {{ t('search.filter') }}
                </button>
              </div>
            </slot>
            <!-- @slot to display the action buttons. Please do fill it in your calling component! -->
            <slot
              name="action"
              :sort="sort"
              :total="page.total"
              :from="page.from"
              :size="page.size"
              :items="items"
              :do-change-page="changePage"
              :do-set-display-filters="doSetDisplayFilters"
            ></slot>
            <!-- @slot to display the sort select if sort options are available. -->
            <slot name="sort" :sort="sort" :sort-options="sortOptions">
              <div class="search__sort" v-if="sortOptions && sortOptions.length > 0">
                <label class="sort__label">{{ t('search.sort.label') }}</label>
                <select v-model="sort" class="sort__select">
                  <option v-for="option in sortOptions" :key="option.value" :value="option">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </slot>
            <!-- @slot to display the results informations (number of results...). Please do fill it in your calling component! -->
            <slot
              name="stats"
              :total="page.total"
              :from="page.from"
              :size="page.size"
              :do-change-page="changePage"
              :do-set-display-filters="doSetDisplayFilters"
            >
              <div class="search__stats">
                <div class="total">
                  <span class="text-sm">{{
                    t('search.results.count', { count: page.total })
                  }}</span>
                </div>
                <div v-if="pagination" class="search__pagination">
                  <search-pagination
                    :total="page.total"
                    :from="page.from"
                    :size="page.size"
                    @change="changePage($event)"
                  >
                  </search-pagination>
                </div>
              </div>
            </slot>
          </div>
          <!-- @slot to display the results. Please do fill it in your calling component! -->
          <slot name="items" :items="items" :total="total" :response="response">
            <div v-for="hit in items" :key="hit.id">
              <pre>{{ hit }}</pre>
            </div>
          </slot>
          <!-- @slot to display the pagination at the bottom of the page.-->
          <slot
            name="pagination"
            :total="page.total"
            :from="page.from"
            :size="page.size"
            :change-page="changePage"
          >
            <div v-if="pagination" class="search__pagination">
              <search-pagination
                :total="page.total"
                :from="page.from"
                :size="page.size"
                @change="changePage($event)"
              >
              </search-pagination>
            </div>
          </slot>
        </template>
        <template v-else>
          <!-- @slot to display the "no results" message and the product history. -->
          <slot name="no-results" :total="total" :response="response">
            <div class="results__noresults">{{ t('search.noresults') }}</div>
            <client-only>
              <div class="results__history">
                <product-history></product-history>
              </div>
            </client-only>
          </slot>
        </template>
      </slot>
      <!-- @slot at the bottom of the result part -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { SearchSortItem } from '#models'
import type { Query } from 'elastic-builder'
import esb, { CardinalityAggregation, FilterAggregation } from 'elastic-builder'
import { provide, reactive, type PropType } from 'vue'

export interface Filter {
  name: string
  title: string
  values: any[]
  setValues: (values: any[]) => void
  getValuesLabels: () => string
  getFilterAggregation: (query: Query | null) => FilterAggregation
  getQueryAggregation: () => void
}

const props = defineProps({
  query: {
    type: Function,
    required: false,
    default: () => {
      return esb.matchAllQuery()
    }
  },
  suggesters: {
    type: Array<() => esb.PhraseSuggester>,
    required: false,
    default: null
  },
  size: {
    // pageSize
    type: Number,
    default: 40
  },
  transformResult: {
    type: Function,
    required: false,
    default: null
  },
  provider: {
    type: Function,
    required: true
  },
  pagination: {
    type: Boolean,
    default: false
  },
  fetchOnServer: {
    type: Boolean,
    default: true
  },
  cardinalityField: {
    type: String,
    default: null
  },
  sortOptions: {
    type: Array as PropType<Array<SearchSortItem>>,
    default: () => {
      return []
    }
  }
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const error = ref<any>(null)
const filters = reactive([] as Filter[])
const loading = ref(true)
const displayfilters = ref(false)
const sort = ref(props?.sortOptions[0] || (null as SearchSortItem | null))
const page = reactive({
  size: props.size,
  from: route.query.page?.toString() ? (parseInt(route.query.page.toString()) - 1) * props.size : 0,
  total: 0
})
const response = ref({
  aggregations: null,
  suggestions: null,
  hits: null,
  total: 0
})
const items = computed(() => {
  if (typeof props.transformResult == 'function') {
    return props.transformResult(response)
  }
  return response?.value.hits || []
})
const total = computed(() => {
  return response?.value.total
})

const doSetDisplayFilters = (show: boolean) => {
  displayfilters.value = show
}

/**
 * declareFilter declare a new filter on the searchBase component
 * @param filter Filter
 */
const declareFilter = (filter: Filter) => {
  filters.push(filter)
}

/**
 * getFiltersQuery return the query for all filters declared except the list passed as parameter
 */
const getFiltersQuery = (excludedFilter: string[] = []) => {
  const must: any[] =
    filters
      .filter((filter: any) => {
        return !excludedFilter.includes(filter.name) && filter.getQueryAggregation() !== null
      })
      .map((f) => f.getQueryAggregation()) || []

  return must.length > 0 ? esb.boolQuery().must(must) : null
}

/**
 * getFiltersAggregation return the aggregation for all filters declared
 * call getFilterAggregation function on each filter
 */
const getFiltersAggs = () => {
  return filters
    .map((filter: Filter) => {
      const query: Query | null = getFiltersQuery([filter.name])
      return filter?.getFilterAggregation(query) as unknown as CardinalityAggregation
    })
    .filter((agg) => agg !== null)
}

/**
 * Search: search function get items from provider
 */
interface SearchResponse {
  aggregations: any
  hits: any
  total: number
  suggestions: any
}

const fetchSearch = async (): Promise<SearchResponse> => {
  if (typeof props?.provider !== 'function') {
    throw new Error('No provider function found')
  }
  const res = {
    aggregations: null,
    hits: null,
    total: 0,
    suggestions: null
  } as SearchResponse
  try {
    error.value = null
    const postFilter = getFiltersQuery()
    const aggs: any[] = getFiltersAggs() || null
    const body = esb.requestBodySearch().query(props.query()).size(page.size).from(page.from)

    // Add suggesters if any
    if (props.suggesters) {
      props.suggesters.forEach((suggester) => {
        body.suggest(suggester())
      })
    }

    if (props.cardinalityField) {
      let agg: CardinalityAggregation | FilterAggregation = new CardinalityAggregation(
        'total',
        props.cardinalityField
      )
      if (postFilter) {
        agg = new FilterAggregation('total', postFilter).agg(agg)
      }
      aggs.push(agg)
    }
    if (aggs !== null) {
      body.aggs(aggs)
    }
    if (postFilter !== null) {
      body.postFilter(postFilter)
    }
    if (sort.value !== null) {
      body.sort(esb.sort(sort.value.value, sort.value.order || 'asc'))
    }
    const fetchedData = await props?.provider(body.toJSON())
    if (fetchedData) {
      const { aggregations, hits, total, suggestions } = fetchedData
      res.aggregations = aggregations || null
      res.hits = hits
      res.suggestions = suggestions

      if (props.cardinalityField) {
        res.total = aggregations?.total?.total?.value || aggregations?.total?.value || 0
      } else {
        res.total = total || 0
      }
    }
  } catch (e: any) {
    error.value = e?.message || e
  }
  return res
}

const search = async () => {
  loading.value = true
  const { aggregations, hits, total, suggestions } = await fetchSearch()
  response.value.aggregations = aggregations
  response.value.hits = hits
  response.value.suggestions = suggestions
  page.total = total
  loading.value = false
}

/**
 * changePage: display results from the given page number
 * @param from: position of the first item to display
 */
const changePage = async (from: number) => {
  page.from = from
  await search()
  if (window?.scrollTo) {
    window.scrollTo(0, 0)
    router.push({ query: { ...route.query, page: from / props.size + 1 } })
  }
}

const { data } = await useAsyncData(async () => {
  const a = await fetchSearch()
  return a
})

watch(
  () => sort.value,
  async () => {
    await search()
  },
  { deep: true }
)

watch(
  () => props.size,
  async () => {
    page.size = props.size
    await changePage(0)
  }
)

onMounted(async () => {
  await search()
})

// Provide some methods and data to the other components (to be injected)
provide('search', () => {
  // Reset the page to 0 when a new search is performed due to a filter change
  page.from = 0
  search()
})
provide('declareFilter', declareFilter)
provide(
  'response',
  computed(() => {
    return JSON.parse(JSON.stringify(response.value))
  })
)
provide(
  'filters',
  computed(() => filters)
)

if (data?.value) {
  response.value.aggregations = data.value.aggregations
  response.value.hits = data.value.hits
  page.total = data.value.total
  loading.value = false
}
</script>
<style lang="scss" scoped>
.search {
  @apply flex min-h-screen flex-row flex-wrap;
  &__filters {
    @apply hidden w-full p-1 py-4 lg:flex lg:w-1/4 xl:w-1/5;
    .filters {
      &__action {
        @apply hidden;
      }
      &__container {
        @apply flex-1 overflow-auto;
      }
    }
    &--active {
      @apply left-0 top-0 z-50 flex h-screen w-screen flex-col bg-white max-lg:fixed;
      .filters {
        &__action {
          @apply flex justify-center border-t pt-4;
          button {
            @apply btn btn-primary;
          }
        }
      }
    }
  }
  &__loading {
    @apply flex min-h-screen w-full items-center justify-center;
  }
  &__results {
    @apply w-full px-4 lg:w-3/4 xl:w-4/5;
    .results {
      &__noresults {
        @apply flex flex-col items-center justify-center py-32 text-xl;
      }
      &___history {
        @apply p-4;
      }
    }
  }
  &__pagination {
    @apply py-5 text-center;
  }
  &__header {
    @apply flex flex-wrap items-center justify-end gap-2 md:justify-between;
    .search__pagination {
      @apply py-0;
    }
  }
  &__stats {
    @apply flex w-full flex-grow flex-wrap items-center justify-between pb-4;
  }
  &__sort {
    @apply flex flex-row items-center;
    .sort__select {
      @apply select select-bordered select-sm ml-2;
    }
  }
  &__display-filters {
    @apply flex flex-1 justify-end lg:hidden;
    button {
      @apply btn btn-primary btn-sm px-10;
    }
  }
}
</style>
