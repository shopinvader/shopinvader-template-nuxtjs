<template>
  <div class="search">
    <div class="search__filters">
      <button
        type="button"
        class="btn btn-outline lg:hidden"
        @click="displayfilters = !displayfilters"
      >
        {{ $t('search.filter') }}
      </button>
      <div class="filters" :class="{ 'filters--active': displayfilters }">
        <slot name="filters"></slot>
      </div>
    </div>
    <div class="search__results">
      <slot name="header"></slot>
      <slot name="results" :items="items" :total="total" :response="response">
        <template v-if="loading">
          <slot name="loading">
            <div class="search__loading">
              <search-loader></search-loader>
            </div>
          </slot>
        </template>
        <template v-else-if="items?.length > 0">
          <div class="search__header">
            <slot name="pagination" :total="page.total" :from="page.from" :size="page.size">
              <div class="search__stats">
                <div class="total">
                  <span class="text-sm">{{
                    $t('search.results.count', { count: page.total })
                  }}</span>
                </div>
              </div>
            </slot>
            <slot name="sort" :sort="sort" :sort-options="sortOptions">
              <div class="search__sort">
                <label class="sort__label">{{ $t('search.sort.label') }}</label>
                <select v-model="sort" class="sort__select">
                  <option v-for="option in sortOptions" :key="option.value" :value="option">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </slot>
          </div>
          <slot name="items" :items="items" :total="total" :response="response">
            <div v-for="hit in items" :key="hit.id">
              <pre>{{ hit }}</pre>
            </div>
          </slot>
          <slot name="pagination" :total="page.total" :from="page.from" :size="page.size">
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
          <slot name="no-results" :total="total" :response="response">
            <div class="results__noresults">{{ $t('search.noresults') }}</div>
            <product-history></product-history>
          </slot>
        </template>
      </slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import esb, { CardinalityAggregation, FilterAggregation, Query } from 'elastic-builder'
import { provide, reactive, type PropType } from 'vue'
import ProductHistory from '~/components/product/ProductHistory.vue'

export interface Filter {
  name: string
  title: string
  values: any[]
  setValues: (values: any[]) => void
  getValuesLabels: () => string
  getFilterAggregation: (query: Query | null) => FilterAggregation
  getQueryAggregation: () => void
}
export interface SortItem {
  label: string
  value: string
  order?: string
}
export default {
  components: {
    'product-history': ProductHistory
  },
  props: {
    query: {
      type: Function,
      required: false,
      default: () => {
        return esb.matchAllQuery()
      }
    },
    size: {
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
      type: Array as PropType<Array<SortItem>>,
      default: () => {
        return []
      }
    }
  },

  async setup(props) {
    const provider = useShopinvaderProviders('products')
    if (provider === null) {
      throw new Error('No provider found for products')
    }
    let error = ref(null)
    let filters = reactive([] as Filter[])
    let loading = ref(true)
    let displayfilters = ref(false)
    let sort = ref(props?.sortOptions[0] || (null as SortItem | null))

    let page = reactive({
      size: props.size,
      from: 0,
      total: 0
    })

    let response = ref({
      aggregations: null,
      hits: null,
      total: 0
    })

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
    const search = async () => {
      if (typeof props?.provider !== 'function') {
        throw new Error('No provider function found')
      }
      loading.value = true
      let postFilter = getFiltersQuery()
      let aggs: any[] = getFiltersAggs() || null

      const body = esb.requestBodySearch().query(props.query()).size(page.size).from(page.from)

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
      const { aggregations, hits, total } = await props?.provider(body.toJSON())
      response.value.aggregations = aggregations || null
      response.value.hits = hits
      if (props.cardinalityField) {
        page.total = aggregations?.total?.total?.value || aggregations?.total?.value || 0
      } else {
        page.total = total || 0
      }
      loading.value = false
    }

    /**
     * changePage
     * @param from
     */
    const changePage = (from: number) => {
      page.from = from
      search()
    }

    provide('search', search)
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

    return {
      response,
      filters,
      page,
      loading,
      displayfilters,
      sort,
      error,
      changePage,
      search
    }
  },
  computed: {
    items(): any[] {
      if (typeof this.transformResult == 'function') {
        return this.transformResult(this.response)
      }
      return this?.response?.hits || []
    },
    total(): any {
      return this?.response?.total
    }
  },

  watch: {
    sort: {
      handler: function () {
        this.search()
      },
      deep: true
    }
  },
  mounted() {
    this.search()
  }
}
</script>
<style lang="scss" scoped>
.search {
  @apply flex min-h-screen flex-row flex-wrap;
  &__filters {
    @apply w-full p-1 py-4 lg:w-1/4 xl:w-1/5;
    .filters {
      @apply hidden lg:block;
      &--active {
        @apply block;
      }
    }
  }
  &__loading {
    @apply flex min-h-screen  w-full items-center justify-center;
  }
  &__results {
    @apply w-full px-4 lg:w-3/4 xl:w-4/5;
    .results {
      &__noresults {
        @apply flex flex-col items-center justify-center py-32 text-xl;
      }
    }
  }
  &__pagination {
    @apply py-5 text-center;
  }
  &__header {
    @apply flex items-center justify-between;
  }
  &__stats {
    @apply py-5 text-center;
  }
  &__sort {
    @apply flex flex-row items-center;
    .sort__select {
      @apply select select-bordered select-sm ml-2;
    }
  }
}
</style>
