<template>
  <div class="search">
    <div class="search__filters">
      <slot name="filters"></slot>
    </div>
    <div class="search__results">
      <slot name="header"></slot>
      <slot name="results" :items="items" :total="total" :response="response">
        <template v-if="loading">
          <slot name="loading">
            <div class="search__loading">
              <div class="spinner"></div>
            </div>
          </slot>
        </template>
        <template v-else-if="items?.length > 0">
          <slot name="pagination" :total="page.total" :from="page.from" :size="page.size">
            <div class="search__stats">
              <div class="total">
                <span class="text-xs">{{page.total}} results</span>
              </div> 
            </div>
          </slot> 
          <slot name="items" :items="items" :total="total" :response="response">
            <div v-for="hit in items" :key="hit.id">
              <pre>{{ hit }}</pre>
            </div>
          </slot>
          <slot  name="pagination" :total="page.total" :from="page.from" :size="page.size">
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
import { provide, reactive } from 'vue'
import esb, { Query } from 'elastic-builder'; 

export interface Filter {
  name: string 
  title: string
  values: any[]
  setValues: Function
  getValuesLabels: Function
  getFilterAggregation: Function
  getQueryAggregation: Function
}
export default {
  props: {
    query: {
      type: Object,
      default: () => {
        return esb.requestBodySearch()
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
    pagination: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    items():any[] {
      if(this.transformResult !== null) {
        return this.transformResult(this.response)
      }
      return this.hits?.hits.map((hit:any) => {
        return hit._source
      })
    },
    total():any[] {
      return this.hits?.total
    }
  },
  mounted() {
    this.search()
  },
  setup(props) {
    const shopinvader = useShopinvader()
    const provider = shopinvader.providers?.['products']
    if(provider === null) {
      throw new Error('No provider found for products')
    }
    let filters = reactive([] as Filter[])
    let loading = ref(false)
    let page = reactive({
      size: props.size,
      from: 0,
      total: 0,
    })

    let response = reactive({
      aggregations:null,
      hits: null
    })

    const declareFilter = (filter:Filter) => {
      filters.push(filter)
    }

    const getFiltersQuery = (excludedFilter: string[] = []) => {
      const must =  filters.filter((filter: any) => {
        return !excludedFilter.includes(filter.name) && filter.getQueryAggregation() !== null
      }).map((f) => f.getQueryAggregation()) || []
      
      return must.length > 0 ? esb.boolQuery().must(must) : null
    }

    const getFiltersAggs = () => {
      
      return filters.map((filter:Filter) => {
        const query = getFiltersQuery([filter.name])
        return filter?.getFilterAggregation(query)
      })
    }

    const search = async () => {
      loading.value = true
      let postFilter = getFiltersQuery()
      let aggs = getFiltersAggs() || null
      const body = 
        esb.requestBodySearch()
        .query(esb.matchAllQuery())
        .size(page.size)
        .from(page.from)
      
      if (aggs !== null) {
        body.aggs(aggs)
      }
      if (postFilter !== null) {
        body.postFilter(postFilter)
      }

      const { aggregations, hits } = await provider.search(body.toJSON())
      response.aggregations = aggregations || null
      response.hits = hits
      page.total = hits?.total?.value || 0
      loading.value = false
    }

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
    @apply md:w-1/3 lg:w-1/4 xl:w-1/5 bg-neutral-content p-4;
  }
  &__results {
    @apply md:w-2/3 lg:w-3/4 xl:w-4/5 px-4;
  }
  &__pagination {
    @apply text-center py-5;
  }
}
</style>