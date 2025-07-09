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
    <div class="search__header">
      <!-- @slot on top of the result part. Best place to display a title. -->
      <slot
        name="header"
        :do-change-page="changePage"
        :do-set-display-filters="doSetDisplayFilters"
      ></slot>
    </div>
    <div class="search__actions">
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
        :loading="loading"
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
      <slot name="sort" :sort="sort" :sort-options="sortOptions" :loading="loading">
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
        :loading="loading"
      >
        <div class="search__stats">
          <div class="total">
            <span class="text-sm">{{ t('search.results.count', { count: page.total }) }}</span>
          </div>
        </div>
      </slot>
    </div>
    <!--------------------------------------------------->
    <!-- Results at right (fullscreen on small screen) -->
    <div class="search__results" ref="resultsContainer">
      <!-- @slot displaying results -->
      <slot name="results" :items="items" :total="total" :response="response" :loading="loading">
        <template v-if="pagination && loading">
          <!-- @slot to display the loading animation -->
          <slot name="loading">
            <div class="search__loading">
              <search-loader></search-loader>
            </div>
          </slot>
        </template>
        <template v-else-if="page.total > 0">
          <div
            v-for="(itemsPage, p) in itemsPaginated"
            class=""
            :key="p"
            ref="pageResultsContainer"
          >
            <!-- @slot to display the results. Please do fill it in your calling component! -->
            <slot
              name="items"
              :items="itemsPage"
              :total="page.total"
              :from="page.from"
              :size="page.size"
              :response="response"
              :loading="loading"
            >
              <div v-for="hit in items" :key="hit.id">
                <pre>{{ hit }}</pre>
              </div>
            </slot>
          </div>
          <!-- @slot to display the pagination at the bottom of the page.-->
          <slot name="pagination" :total="page.total" :from="page.from" :size="page.size">
            <div class="search__pagination">
              <search-pagination
                v-if="pagination"
                :total="page.total"
                :from="page.from"
                :size="page.size"
                @change="changePage"
              >
              </search-pagination>
              <div v-else class="search__infinitescroll">
                <div>
                  <button @click="scrollToTop" class="infinitescroll__up">
                    <icon name="up" />
                  </button>
                </div>
              </div>
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
      <div v-if="!pagination" ref="infinitScrollTrigger" class="results__infinitscroll"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { SearchSortItem } from '#models'
import type { Query } from 'elastic-builder'
import esb, { CardinalityAggregation, FilterAggregation } from 'elastic-builder'
import { provide, reactive, type PropType } from 'vue'
import { useHistoryStore } from '~/stores/history'
import isEqual from '~/utils/IsEqual'

export interface Filter {
  name: string
  title: string
  values: any[]
  urlParam: string
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

let observer: IntersectionObserver = null
const infinitScrollTrigger = ref<HTMLElement | null>(null)
const resultsContainer = ref<HTMLElement | null>(null)
const pageResultsContainer = ref<HTMLElement[]>([])
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
  hits: [] as any[],
  total: 0
})
let timer: NodeJS.Timeout | null = null
const items = computed(() => {
  let items = []
  if (typeof props.transformResult == 'function') {
    items = props.transformResult(response)
  }
  items = response?.value.hits || []
  return items.filter((item) => item !== null)
})

/** Use only for infinit scroll */
const itemsPaginated = computed(() => {
  const pages = []
  const pageCount = Math.ceil(response?.value.hits?.length / props.size)
  for (let i = 0; i < pageCount; i++) {
    pages[i] = items.value.slice(i * props.size, (i + 1) * props.size)
  }

  return pages
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
 * changePage: display results from the given page number
 * @param from: position of the first item to display
 */
const changePage = async (from: number) => {
  page.from = from
  if (window?.scrollTo) {
    window.scrollTo(0, 0)
    router.push({ query: { ...route.query, page: Math.ceil(from / props.size + 1) } })
  }
}

const scrollToTop = () => {
  if (window?.scrollTo) {
    window.scrollTo(0, 0)
  }
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
    hits: [] as any[],
    total: 0,
    suggestions: null
  } as SearchResponse
  try {
    let size = props.size
    let from = page.from
    if (!props.pagination) {
      /* Infinite scroll */
      const to = page.from + page.size
      from = response.value.hits.findIndex((hit) => !hit?.id)
      if (from < 0) {
        from = response.value?.hits?.length || 0
      }
      size = to - from
    }
    error.value = null
    const postFilter = getFiltersQuery()
    const aggs: any[] = getFiltersAggs() || null
    const body = esb.requestBodySearch().query(props.query()).size(size).from(from)

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
      if (sort.value?.script) {
        body.sort(
          esb
            .sort()
            .type('number')
            .script(sort.value.script)
            .order(sort.value.order || 'asc')
        )
      } else {
        body.sort(esb.sort(sort.value.value, sort.value.order || 'asc'))
      }
    }
    const fetchedData = await props?.provider(body.toJSON())
    if (fetchedData) {
      const { aggregations, hits, total, suggestions } = fetchedData
      res.aggregations = aggregations || null
      if (props.pagination) {
        res.hits = hits || []
      } else {
        /** Merge result for infinit scroll */
        for (let i = 0; i < from + size; i++) {
          if (hits[i - from]) {
            res.hits[i] = hits[i - from]
          } else if (response.value?.hits?.[i]) {
            res.hits[i] = response.value.hits[i]
          } else {
            res.hits[i] = null
          }
        }
      }
      res.suggestions = suggestions

      if (props.cardinalityField) {
        res.total = aggregations?.total?.total?.value || aggregations?.total?.value || 0
      } else {
        res.total = total || 0
      }
    }
  } catch (e: any) {
    console.error(e)
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
watch(
  () => sort.value,
  async () => {
    response.value.hits = []
    if (page.from > 0) {
      changePage(1)
    }
    await search()
  },
  { deep: true }
)

watch(
  () => route.query,
  async (queries, oldQueries) => {
    const watchedQueryParams = filters.map((f) => f.urlParam)
    let filterHasChanged = false
    for (const key of watchedQueryParams) {
      let value = JSON.parse(queries?.[key]?.toString() || '[]')
      let oldValue = JSON.parse(oldQueries?.[key]?.toString() || '[]')
      value = !Array.isArray(value) ? [value] : value
      oldValue = !Array.isArray(oldValue) ? [oldValue] : oldValue
      if (!isEqual(value.sort(), oldValue.sort())) {
        filterHasChanged = true
        continue
      }
    }
    if (filterHasChanged) {
      response.value.hits = []
      if (page.from > 0) {
        changePage(1)
      }
    } else {
      page.from = parseInt(queries?.page?.toString() || '1') * props.size - props.size
    }
    if (filterHasChanged || queries?.page != oldQueries?.page) {
      await search()
    }
  },
  { deep: true }
)

/** Infinit Scroll : Mount element observer */
const mountInfinitScrollObserver = () => {
  observer = new IntersectionObserver(
    async ([entry]) => {
      if (entry && entry.isIntersecting) {
        const pageCount = Math.ceil(page.total / props.size)
        const currentPage = itemsPaginated.value?.length
        if (currentPage < pageCount) {
          router.push({ query: { ...route.query, page: currentPage + 1 } })
        }
      }
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.8
    }
  )

  observer.observe(infinitScrollTrigger.value as HTMLElement)
}
const history = useHistoryStore()
const onWindowScroll = () => {
  history.lastSearchScroll = {
    url: route.fullPath,
    y: window.scrollY
  }
}
/** Infinit Scroll : Unmount element observer */
const unMountInfinitScrollObserver = () => {
  if (observer) {
    observer.disconnect()
  }
  if (timer) {
    clearTimeout(timer)
  }
}

onMounted(async () => {
  if (Object.values(route.query)?.length) {
    response.value.hits = []
  }
  await search()
  if (!props.pagination) {
    mountInfinitScrollObserver()
    const lastSearchScroll = history.lastSearchScroll
    if (lastSearchScroll?.url === route.fullPath && lastSearchScroll?.y) {
      window.scrollTo(0, lastSearchScroll?.y)
    } else {
      const queryPage = parseInt(route.query.page?.toString() || '1')
      if (queryPage && pageResultsContainer.value?.[queryPage]) {
        pageResultsContainer.value?.[queryPage].scrollIntoView()
      }
    }
    document.addEventListener('scroll', onWindowScroll)
  }
})

onUnmounted(() => {
  unMountInfinitScrollObserver()
  document.removeEventListener('scroll', onWindowScroll)
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

// Provide some methods and data to the other components (to be injected)
provide('search', () => {
  search()
})

const { data } = await useAsyncData(async () => {
  const a = await fetchSearch()
  return a
})

if (data?.value) {
  response.value.aggregations = data.value.aggregations
  response.value.hits = data.value.hits
  page.total = data.value.total
  loading.value = false
}
</script>
<style lang="scss" scoped>
.search {
  @apply grid min-h-screen grid-cols-1 gap-2 px-2 py-4 lg:grid-cols-4 xl:grid-cols-5;
  &__filters {
    @apply row-span-5 hidden h-full w-full p-1 py-4 lg:flex;
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
  &__header {
    @apply flex w-full flex-wrap items-center justify-stretch gap-2 pt-3 md:justify-between lg:col-span-3 xl:col-span-4;
    .search__pagination {
      @apply py-0;
    }
  }
  &__actions {
    @apply flex flex-col justify-between gap-2 py-2 lg:col-span-3 xl:col-span-4;
  }
  &__loading {
    @apply relative flex min-h-screen w-full items-center justify-center lg:col-span-3 xl:col-span-4;
  }
  &__results {
    @apply relative w-full px-4 lg:col-span-3 xl:col-span-4;
    .results {
      &__noresults {
        @apply flex flex-col items-center justify-center py-32 text-xl;
      }
      &__history {
        @apply p-4;
      }
      &__infinitscroll {
        content: '';
        @apply absolute bottom-0 -z-50 h-5 w-5;
      }
    }
  }
  &__pagination {
    @apply py-5 text-center lg:col-span-3 xl:col-span-4;
  }
  &__infinitescroll {
    @apply min-h-16 lg:col-span-3 xl:col-span-4;
    .infinitescroll {
      &__more {
        @apply btn btn-outline btn-primary btn-sm;
      }
      &__up {
        @apply btn btn-circle btn-primary fixed bottom-16 right-4 z-10 text-white shadow;
        .icon {
          @apply h-5 w-5 text-ellipsis text-lg;
        }
      }
    }
  }

  &__stats {
    @apply flex w-full flex-grow flex-wrap items-center justify-between pb-4;
    .search__pagination {
      @apply py-0;
    }
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
