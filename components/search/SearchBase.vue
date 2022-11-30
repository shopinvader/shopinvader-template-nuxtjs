<template>
  <div class="search">
    <div class="search__filters">
      <button type="button" class="btn btn-outline btn-sm lg:hidden" @click="displayfilters = !displayfilters">
        {{ $t('search.filter') }}
      </button>
      <div class="filters" :class="{'filters--active':displayfilters}">
        <slot name="filters"></slot>
      </div>
    </div>
    <div class="search__results">
      <slot name="header"></slot>
      <slot name="results" :items="items" :total="total" :response="response">
        <template v-if="loading">
          <slot name="loading">
            <div class="search__loading">
              <spinner></spinner>
            </div>
          </slot>
        </template>
        <template v-else-if="items?.length > 0">
          <div class="search__header">
            <slot name="pagination" :total="page.total" :from="page.from" :size="page.size">
              <div class="search__stats">
                <div class="total">
                  <span class="text-sm">{{ $t('search.results.count', { count: page.total })}}</span>
                </div> 
              </div>
            </slot> 
            <slot name="sort" :sort="sort" :sortOptions="sortOptions">
              <div class="search__sort">
                <label class="sort__label">{{ $t('search.sort.label') }}</label>
                <select class="sort__select" v-model="sort">
                  <option v-for="option in sortOptions" :value="option">
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
            <div>{{ $t('search.noresults') }}</div>
          </slot>
        </template>
      </slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { provide, reactive, PropType } from 'vue'
import Spinner from '~/components/global/Spinner.vue'
import esb from 'elastic-builder'; 

export interface Filter {
  name: string 
  title: string
  values: any[]
  setValues: Function
  getValuesLabels: Function
  getFilterAggregation: Function
  getQueryAggregation: Function
}
export interface SortItem {
  label: string,
  value: string
}
export default {
  components: {
    spinner: Spinner
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
      required: false
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
    sortOptions: {
      type: Array as PropType<Array<SortItem>>,
      default: () => {
        return []
      }
    }
  },
  computed: {
    items():any[] {
      if(typeof this.transformResult == 'function') {
        return this.transformResult(this.response)
      }
      return this.response.hits
    },
    total():any[] {
      return this.response?.total
    }
  },
  mounted() {
   this.search()
  },

  watch: {
    sort: {
      handler: function() {
        this.search()
      },
      deep: true
    }
  },

  async setup(props) {
    const shopinvader = useShopinvader()
    const provider = shopinvader.providers?.['products']
    if(provider === null) {
      throw new Error('No provider found for products')
    }

    let filters = reactive([] as Filter[])
    let loading = ref(true)
    let displayfilters = ref(false)
    let sort = ref(props?.sortOptions[0] || null as SortItem | null)
    
    let page = reactive({
      size: props.size,
      from: 0,
      total: 0,
    })

    let response = reactive({
      aggregations:null,
      hits: null,
      total: 0
    })

    /**
     * declareFilter declare a new filter on the searchBase component
     * @param filter Filter
     */
    const declareFilter = (filter:Filter) => {
      filters.push(filter)
    }

    /**
     * getFiltersQuery return the query for all filters declared except the list passed as parameter
     */
    const getFiltersQuery = (excludedFilter: string[] = []) => {
      const must =  filters.filter((filter: any) => {
        return !excludedFilter.includes(filter.name) && filter.getQueryAggregation() !== null
      }).map((f) => f.getQueryAggregation()) || []
      
      return must.length > 0 ? esb.boolQuery().must(must) : null
    }

    /**
     * getFiltersAggregation return the aggregation for all filters declared
     * call getFilterAggregation function on each filter
     */
    const getFiltersAggs = () => {
      return filters.map((filter:Filter) => {
        const query = getFiltersQuery([filter.name])
        return filter?.getFilterAggregation(query)
      })
    }

    /**
     * Search : search function get items from provider 
     */
    const search = async () => {
      
      if(typeof props?.provider !== 'function') {
        throw new Error('No provider function found')
      }
      loading.value = true
      let postFilter = getFiltersQuery()
      let aggs = getFiltersAggs() || null

      const body = 
        esb.requestBodySearch()
        .query(props.query())
        .size(page.size)
        .from(page.from)
      
      if (aggs !== null) {
        body.aggs(aggs)
      }
      if (postFilter !== null) {
        body.postFilter(postFilter)
      }
      if(sort.value !== null) {
        body.sort(
          esb.sort(sort.value.value, 'asc')
        )
      }
      const { aggregations, hits, total } = await props?.provider(body.toJSON())
      response.aggregations = aggregations || null
      response.hits = hits
      page.total = total || 0
      loading.value = false
    }

    /**
     * changePage
     * @param from 
     */
    const changePage = (from:number) => {
      page.from = from
      search()
    }
    
    provide('search', search)
    provide('declareFilter', declareFilter)
    provide('response', computed(() => response))
    provide('filters', computed(() => filters))
    
    return {
      response,
      filters,
      page,
      loading,
      displayfilters,
      sort,
      changePage,
      search
    }
  }
}

</script>
<style lang="scss" scoped>
.search {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  &__filters {
    @apply w-full lg:w-1/4 xl:w-1/5 bg-neutral-content p-4;
    .filters {
      @apply hidden lg:block;
      &--active {
        @apply block;
      }
    }
  }
  &__loading {
    @apply w-full h-screen flex justify-center items-center;
  }
  &__results {
    @apply w-full lg:w-3/4 xl:w-4/5 px-4;
  }
  &__pagination {
    @apply text-center py-5;
  }
  &__header {
    @apply flex justify-between items-center;
  }
  &__stats {
    @apply text-center py-5;
  }
  &__sort {
    @apply flex flex-row items-center;
    .sort__label {
  
    }
    .sort__select {
      @apply select select-bordered select-sm ml-2;
    }
  }
}
</style>