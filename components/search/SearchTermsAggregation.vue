<template>
  <div v-if="data?.items?.length > 0" class="searchfilter">
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
    <slot  name="items" :items="data.items" :change="onSelectItem">
      <template v-if="opened">
        <div
          v-for="item in data.items"
          :key="item.key"
          class="searchfilter__items"
        >
          <slot name="items" :item="item" :change="onSelectItem">
            <label
              class="item"
              :class="{ 'item--active': data.selected.includes(item.key) }"
            >
              <input
                v-model="data.selected"
                type="checkbox"
                class="item__checkbox"
                :value="item.key"
                @change="onSelectItem()"
              />
              <span class="item__label">{{ item.key }}</span>
              <span class="item__count">{{ item.doc_count }}</span>
            </label>
          </slot>
        </div>
      </template>
    </slot>
    <slot name="footer" :items="data.items" :size="size"> </slot>
  </div>
</template>
<script lang="ts">
import { inject, reactive } from 'vue'
import {
  Aggregation,
  BoolQuery,
  FilterAggregation,
  MatchAllQuery,
  NestedAggregation,
  NestedQuery,
  Query,
  TermsAggregation,
  TermsQuery,
  TermQuery,
  cardinalityAggregation
} from 'elastic-builder'
interface FacetItem {
  key: string
  doc_count: number
}
import { Filter } from './SearchBase.vue'
import { Card } from '.nuxt/components'
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
    urlParam: {
      type: String,
      required: false,
      default: null
    }
  },
  async setup(props) {
    const opened = ref(!props.close)
    const data = reactive({
      selected: [] as string[],
      items: [] as FacetItem[],
      total: 0,
      size: props.size
    })
    const declareFilter: ((params: Filter) => void) | null =
      inject('declareFilter') || null
    const search: (() => void) | null = inject('search') || null
    const response: (() => void) | null = inject('response') || null
    const getValuesLabels = () => {
      return data.selected.join(', ')
    }
    const getFilterAggregation = (query: BoolQuery): Aggregation => {
      let agg: Aggregation = new TermsAggregation(props.name, props.field)
        .order('_term', 'asc')
        .size(data.size)

      if (props.transformQuery !== null) {
        query = props.transformQuery(query, props.name, props.field)
      }
      if (props.cardinalityField !== null) {
        agg.agg(
          cardinalityAggregation(
            props.name + '_cardinality',
            props.cardinalityField
          )
        )
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

      if (data?.selected?.length > 0) {
        aggs = new TermsQuery(props.field, data?.selected || [])
        if (props.nestedPath) {
          aggs = new NestedQuery().path(props.nestedPath).query(aggs)
        }
      }
      return aggs
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

    const onSelectItem = () => {
      refreshSearch()
    }

    const refreshSearch = () => {

      if (props.urlParam) {
        const $router = useRouter()
        const $route = useRoute()
        if (data.selected.length > 0) {
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

    return {
      response,
      opened,
      data,
      onSelectItem
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
          let items = []
          const aggregations = response?.aggregations || {}
          if (this.transformData !== null) {
            let data = this.transformData(aggregations)
            items = data?.items || []
          } else {
            let values = aggregations
            while (values !== null) {
              values = values?.[name] || null
              if (values?.buckets) {
                items = values?.buckets
                break
              }
            }
          }
          if (this.cardinalityField) {
            for(let item of items) {
              if(this.nestedPath) {
                item.doc_count = null
              } else {
                item.doc_count = item[this.name + '_cardinality']?.value || item.doc_count
              }
            }
          }
          if (this.transformItems !== null) {
            let transformedItems = this.transformItems(items)
            items = transformedItems?.items || items
          }
          this.data.items = items || []
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
<style lang="scss">
.searchfilter {
  @apply mb-3 bg-gray-50 hover:bg-gray-100 p-5;
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
}
</style>
