<template>
  <div v-if="loaded || 1==1" class="searchfilter filter-price-range">
    <slot name="title" :title="title">
      <div class="searchfilter__header" @click="opened = !opened">
        <div class="header__title">
          {{ title }}
        </div>
        <div class="header__close">
          <icon :icon="opened ? 'uiw:up': 'uiw:down'" />
        </div>
      </div>
    </slot>
    <slot name="items" :items="data.stats" :change="onChangeValues">
      <template v-if="opened">

        <range-slider
          class="searchfilter__input"
          show-tooltip="none"
          :tooltips="false"
          :min="originalMin || 0"
          :max="originalMax || 0"
          :step="1"
          v-model="values"
          @update="onChangeValues"
        >
        </range-slider>
        <div class="searchfilter__range">
          <div class="range__min">
            <div class="min__label">
              {{ $filter.currency(originalMin || 0) }}
            </div>
          </div>
          <div class="range_max">
            <div class="max__label">
              {{ $filter.currency(originalMax || 0) }}
            </div>
          </div>
        </div>
        <div v-if="updated" class="searchfilter__value">
          {{ $t('filters.price_range', {
              min: $filter.currency(values[0]),
              max: $filter.currency(values[1])
            })
          }}
        </div>
      </template>
    </slot>
    <slot name="footer" :items="data.stats" :size="size"> </slot>
  </div>
</template>
<script lang="ts">
import { inject, reactive } from 'vue'
import Slider from '@vueform/slider'
import {
  Aggregation,
  BoolQuery,
  FilterAggregation,
  MatchAllQuery,
  NestedAggregation,
  NestedQuery,
  Query,
  StatsAggregation,
  RangeQuery
} from 'elastic-builder'
interface FacetStat {
  count: number
  min: number
  max: number
  avg: number
  sum: number
}
import { type Filter } from './SearchBase.vue'
export default {
  props: {
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
  components: {
    'range-slider': Slider
  },
  async setup(props) {
    const opened = ref(!props.close)
    const loaded = ref(false)
    const updated = ref(false)
    const originalMin = ref(null)
    const originalMax = ref(null)
    const data = reactive({
      selected: [] as number[],
      stats: {} as FacetStat,
      total: 0,
      size: props.size
    })
    const declareFilter: ((params: Filter) => void) | null =
      inject('declareFilter') || null
    const search: (() => void) | null = inject('search') || null
    const response: (() => void) | null = inject('response') || null
    const getValuesLabels = () => {
      return data.selected.map(i => Math.round(i)).join(' - ')
    }
    const getFilterAggregation = (query: BoolQuery): Aggregation => {
      let agg: Aggregation = new StatsAggregation(props.name, props.field)
      if (props.transformQuery !== null) {
        query = props.transformQuery(query, props.name, props.field)
      }

      if (props.nestedPath) {
        agg = new NestedAggregation(props.name, props.nestedPath).agg(agg)
      }
      let aggregation = new FilterAggregation(
          props.name,
          query || new MatchAllQuery()
        ).aggregation(agg)
      return aggregation

    }

    const getQueryAggregation = () => {
      let aggs: Query | null = null
      if (updated.value) {
        aggs = new RangeQuery(props.field).gte(data.selected[0]).lte(data.selected[1])
        if (props.nestedPath) {
          aggs = new NestedQuery().path(props.nestedPath).query(aggs)
        }
      }
      return aggs
    }

    const setValues = (values: any[]) => {
      data.selected = values
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

    const onChangeValues = () => {
      refreshSearch()
    }

    const refreshSearch = () => {
      updated.value = true
      if (props.urlParam) {
        const $router = useRouter()
        const $route = useRoute()
        if (data.selected?.length > 2) {
          $router.push({
            query: {
              ...$route.query,
              [props.urlParam]: JSON.stringify(data.selected)
            }
          })
        } else {
          const query = { ...$route.query }
          delete query[props.urlParam]
          $router.push({ query })
        }
      }
      if (search !== null) {
        search()
      }
    }

    const values = computed({
      get():number[] {
        if(data?.selected.length == 2) {
          return data.selected
        }
        return [ originalMin.value || 0, originalMax.value || 0 ]
      },
      set(newValue:number[]) {
        data.selected = newValue || []
      }
    })

    return {
      response,
      opened,
      data,
      originalMin,
      originalMax,
      loaded,
      updated,
      values,
      onChangeValues
    }
  },
  watch: {
    $route: {
      handler: function () {
        if (this.urlParam) {
          const $route = useRoute()
          try {
            const query: string =
              ($route.query?.[this.urlParam] as string) || '[]'
            const values: string[] = JSON.parse(query) || []
            if (query?.length > 0 && this.data.selected !== values) {
              this.data.selected = values
            }
          } catch (e) {
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
        if (response?.aggregations) {
          let name = this.name
          const aggregations = response?.aggregations || {}
          let stats = aggregations?.[name]?.[name] || {}

          if (this.transformData !== null) {
            let data = this.transformData(aggregations)
            stats = data?.stat || []
          }
          if (this.transformItems !== null) {
            let transformedItems = this.transformItems(stats)
            stats = transformedItems?.stats || stats
          }

          this.originalMin = stats?.min
          this.originalMax = stats?.max
          this.data.stats = stats || []
          this.loaded = true
        }
      },
      deep: true
    },
    close(val, old) {
      if(val !== old) {
        this.opened = val
      }

    }
  }
}
</script>
<style src="@vueform/slider/themes/default.css"></style>
<style lang="scss">
.filter-price-range.searchfilter {

  .searchfilter {
    @apply mb-3 bg-gray-50 hover:bg-gray-100 p-5 ;
    &__header {
      @apply flex flex-nowrap justify-between items-center mb-2 cursor-pointer;
      .header {
        &__title {
          @apply text-lg font-heading;
        }
        &__close {

        }
      }
    }
    &__input {
      @apply border;
      &.slider-target {

        .slider-connects {
          @apply bg-gray-200;
          .slider-connect {
            @apply bg-primary;
          }
        }
      }
    }
    &__range {
      @apply mt-2 text-xs flex justify-between;
    }
    &__value {
      @apply text-xs pt-2 text-center;
    }
  }

}
</style>
