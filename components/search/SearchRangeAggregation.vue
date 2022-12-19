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
          <label class="item" :class="{'item--active': data.selected === item.key}">
            <input type="radio" class="item__radio" @change="onSelectItem()" :value="item.key" v-model="data.selected"/>
            <span class="item__label">{{ item.label }}</span>
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
import { inject, reactive } from 'vue'
import {
  Aggregation,
  BoolQuery,
  FilterAggregation,
  MatchAllQuery,
  RangeAggregation,
  RangeQuery
} from 'elastic-builder';

import { Filter } from './SearchBase.vue';
export interface RangeItem {
  from?: Number,
  to?: Number,
  label: String
}
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
    },
    rangeItems: {
      type: Array<RangeItem>,
      required: true,
      default: null
    }
  },
  async setup(props) {
    const data = reactive({
      selected: null,
      items: [],
      total: 0,
      size: props.size
    })
    const declareFilter:Function = inject('declareFilter')
    const search:Function = inject('search');
    const response = inject('response');
    const getValuesLabels = () => {
      return data.selected 
    }
    const getFilterAggregation = (query:BoolQuery):Aggregation => {
      let agg:Aggregation = new RangeAggregation(props.name, props.field).ranges(props.rangeItems.map(item => ({from: item.from, to: item.to})))
      if (props.transformQuery !== null) {
        query = props.transformQuery(query, props.name, props.field)
      }

      return new FilterAggregation(props.name, query || new MatchAllQuery()).aggregation(agg)
    }

    const getQueryAggregation = () => {
      let aggs: RangeQuery = new RangeQuery(props.field)

      if(data?.selected !== null) {
        const selectedValue = data?.selected

        const value = data?.items.find((item:any) => item.key === selectedValue)
        aggs = new RangeQuery(props.field).gte(value?.from).lt(value?.to)
      }
      return aggs
    }

    const setValues = (values:any) => {
     data.selected = values || ''
     refreshSearch()
    }
    declareFilter (
      {
        name: props?.name || '',
        title: props.title,
        values: data?.selected,
        setValues: setValues,
        getValuesLabels,
        getFilterAggregation,
        getQueryAggregation
      } as unknown as Filter
    )

    const onSelectItem = () => {
      refreshSearch()
    }

    const refreshSearch = () => {
      if(props.urlParam) {
        const $router = useRouter()
        const $route = useRoute()
        if(data.selected !== null) {
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
            const query:string = $route.query?.[this.urlParam] as string || ''
            const values:string = JSON.parse(query) || ''
            if(query?.length > 0 && this.data.selected !== values) {
              this.data.selected = values
            }
          } catch(e) {
            const $router = useRouter()
            let query = { ...$route.query }
            delete query[this.urlParam]
            $router.replace({ path: $route.path, query })

          }
        }
      },
      immediate: true
    },
    response: {
      handler: function (response) {
        if(response?.aggregations) {
          let name = this.name
          let rangeItems = this.rangeItems
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
          items = items.map((item:any) => {
            const label = rangeItems.find(rangeItem => rangeItem.to === item.to && rangeItem.from === item.from)?.label
            return {...item, label}
          })

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
      &__checkbox, &__radio {
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
