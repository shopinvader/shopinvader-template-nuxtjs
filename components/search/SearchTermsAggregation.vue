<template>
  <div class="searchfilter">
    <slot name="title" :title="title">
      <div class="searchfilter__title">
        {{ title }}
      </div>
    </slot>
    <slot name="items" :items="data.items" :change="onSelectItem">
      <div class="searchfilter__items " v-for="item in data.items">
        <slot name="items" :item="item" :change="onSelectItem">
          <label class="item" :class="{'item--active': data.selected.includes(item.key)}">
            <input type="checkbox" class="item__checkbox" @change="onSelectItem()" :value="item.key" v-model="data.selected"/>
            <span class="item__label">{{ item.key }}</span> 
            <span class="item__count">{{ item.doc_count }}</span>
          </label>
        </slot>
      </div>
    </slot>
    <slot name="footer"  :items="data.items"  :size="size">
    </slot>
  </div>
</template>
<script lang="ts">
import { MatchAllQuery, TermsAggregation, FilterAggregation, TermsQuery, BoolQuery, NestedAggregation, Aggregation, NestedQuery, Query, TermQuery } from 'elastic-builder';
import { inject, reactive } from 'vue'
import { Filter } from './SearchBase.vue';
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    field: {
      type: String,
      required: true
    },
    nestedPath: {
      type: String,
      required: false
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
    urlParam: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props) {
    const data = reactive({
      selected: [],
      items: [],
      total: 0,
      size: props.size
    })
    const declareFilter:Function = inject('declareFilter')
    const search:Function = inject('search');
    const response = inject('response');
    const getValuesLabels = () => {
      return data.selected.join(', ')
    }
    const getFilterAggregation = (query:BoolQuery):Aggregation => {
      let agg:Aggregation = new TermsAggregation(props.name, props.field)
        .order('_term', 'asc')
        .size(data.size)

      if(props.nestedPath) {
        agg = new NestedAggregation(props.name, props.nestedPath)
              .agg(
                new FilterAggregation(props.name, new TermQuery('categories.level', '0')).aggregation(agg)
              )
      } else {
        if (props.transformQuery !== null) {
          query = props.transformQuery(query, props.name, props.field)
        }
      }

      return new FilterAggregation(props.name, query || new MatchAllQuery()).aggregation(agg)
    }
    const getQueryAggregation = () => {
      let aggs:Query = null
      
      if(data?.selected?.length > 0) {
        aggs = new TermsQuery(props.field, data?.selected || [])
        if(props.nestedPath) {
          aggs = new NestedQuery()
            .path(props.nestedPath)
            .query(aggs)
        }
      }
      return aggs
    }

    const setValues = (values:any[]) => {
     data.selected = values || []
     refreshSearch()
    }

    declareFilter ({
      name: props.name,
      title: props.title,
      values: data.selected,
      setValues: setValues,
      getValuesLabels,
      getFilterAggregation,
      getQueryAggregation
    } as Filter)
    const onSelectItem = () => {
      refreshSearch()
    }
    const refreshSearch = () => {
      if(props.urlParam) {
        const $router = useRouter()
        const $route = useRoute()
        if(data.selected.length > 0) {
          $router.push({query: {...$route.query, [props.urlParam]: JSON.stringify(data.selected)}})
        } else {
          const query = {...$route.query}
          delete query[props.urlParam]
          $router.push({query})
        }
      }
      
      search()
    }
    return {
      response,
      data,
      onSelectItem
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if(this.urlParam) {
          const $route = useRoute()
          try {
            const query:string = $route.query?.[this.urlParam] as string
            const values:string[] = JSON.parse(query)
            console.log('values', JSON.parse(query))
            if(query?.length > 0 && this.data.selected !== values) {
              this.data.selected = values
            }
          } catch(e) {
            console.log(e)
            const $router = useRouter()
            let query = { ...$route.query }
            delete query[this.urlParam]
            $router.replace({ path: $route.path, query })

          }
          // const values:string[] = JSON.parse($route.query[this.urlParam] || '[]')
          
          // this.data.selected = values
        }
      },
      immediate: true
    },
    response: {
      handler: function (response) {
        if(response?.aggregations) {
          let name = this.name
          let items = []

          const aggregations = response?.aggregations || {}
          if(this.transformData !== null) {
            let response = this.transformData(aggregations)
            items = response?.items || items
          } else {
            if(this.nestedPath) {
              name = this.nestedPath
            }
            let values = aggregations
            
            while (values !== null) {
              values = values?.[name] || null
              if(values?.buckets) {
                items = values?.buckets
                break
              }
            }
          }
          
          if(this.transformItems !== null) {
            let response = this.transformItems(items)
            items = response?.items || items
          }
          this.data.items = items || []
        }
      },
      deep: true
    }
  }
  
}
</script>
<style lang="scss">
.searchfilter {
  @apply py-2;
  &__title {
    @apply font-bold;
  }
  &__items {
    @apply mt-2 text-xs ;
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
}
</style>