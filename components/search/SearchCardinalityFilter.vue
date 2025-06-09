<template>
  <div class="searchfilter" :class="{ 'searchfilter--opened': opened }">
    <slot name="title" :title="title">
      <div class="searchfilter__header" @click="setToggle">
        <div class="header__title">{{ title }}</div>
        <div class="header__close">
          <icon :name="opened ? 'up' : 'down'" />
        </div>
      </div>
    </slot>
    <slot
      name="items"
      :checked="checked"
      :label="label"
      :total="total"
      :change="onSelectItem"
      :opened="opened"
    >
      <div v-if="opened" class="searchfilter__items">
        <label class="item" :class="{ 'item--active': checked }">
          <input :checked="checked" @change="onSelectItem" type="checkbox" class="item__checkbox" />
          <span class="item__label">{{ label }}</span>
          <span class="item__count">{{ total }}</span>
        </label>
      </div>
    </slot>
    <slot name="footer" :checked="checked"> </slot>
  </div>
</template>
<script lang="ts" setup>
import { inject } from 'vue'
import {
  type Aggregation,
  type BoolQuery,
  type Query,
  CardinalityAggregation,
  NestedQuery,
  TermsQuery,
  FilterAggregation,
  MatchAllQuery
} from 'elastic-builder'

const emit = defineEmits('toggle')
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  toggle: {
    type: Boolean,
    required: false,
    default: null
  },
  close: {
    type: Boolean,
    required: false,
    default: true
  },
  field: {
    type: String,
    required: false,
    default: 'url_key'
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
  urlParam: {
    type: String,
    required: false,
    default: null
  },
  checked: {
    type: Boolean,
    required: false,
    default: null
  },
  value: {
    type: [String, Array as PropType<string[]>, Number, Boolean],
    required: false,
    default: null
  },
  label: {
    type: String,
    required: false,
    default: ''
  }
})

const checked = ref(props.checked || false)
const urlParam = props?.urlParam || props?.name
const router = useRouter()
const route = useRoute()
const total = ref(0)
const opened = ref(!props.close)

const declareFilter: ((params: any) => void) | null = inject('declareFilter') || null
const response: (() => void) | null = inject('response') || null
const getValuesLabels = () => {
  return checked.value ? props.label : ''
}

const getFilterAggregation = (query: BoolQuery): Aggregation | null => {
  if (props.transformQuery !== null) {
    query = props.transformQuery(query, props.name, props.field)
  }
  const agg: Aggregation = new CardinalityAggregation(props.name, props.field)

  return new FilterAggregation(props.name, query || new MatchAllQuery()).aggregations([agg])
}

const getQueryAggregation = () => {
  let aggs: Query | null = null

  if (checked?.value) {
    aggs = new TermsQuery(props.field, props?.value || [])
    if (props.nestedPath) {
      aggs = new NestedQuery().path(props.nestedPath).query(aggs)
    }
    if (props.transformQuery !== null) {
      return props.transformQuery(null, props.name, props.field)
    } else {
      return aggs
    }
  }
  return null
}

const setValue = (value: boolean) => {
  checked.value = value
  router.push({
    query: {
      ...route.query,
      [urlParam]: JSON.stringify(value)
    }
  })
}
if (declareFilter !== null) {
  declareFilter({
    name: props?.name || '',
    title: props.title,
    values: checked.value,
    urlParam,
    setValues: () => {
      setValue(false)
    },
    getValuesLabels,
    getFilterAggregation,
    getQueryAggregation
  })
}

const onSelectItem = () => {
  setValue(!checked.value)
}

watch(
  () => props.toggle,
  (toggle) => {
    setValue(toggle)
  }
)

watch(
  () => props.close,
  (val, old) => {
    if (val !== old) {
      opened.value = val
    }
  }
)

watch(
  () => props.checked,
  (value) => {
    setValue(value)
  }
)
/**
 * Update total count after page.
 */
watch(
  () => response,
  (response: any) => {
    const aggregations = response?.value?.aggregations || null
    if (aggregations) {
      const name = props.name

      if (props.transformData !== null) {
        const data = props.transformData(aggregations)
        total.value = data?.total || 0
      } else {
        total.value = aggregations?.[name]?.[name]?.value || 0
      }
    }
  },
  { deep: true }
)

/**
 * Listen route query change to update filter value if another component
 * has clean the filter value or in case of use "back" or "forward" browser action
 */
watch(
  () => route.query,
  (query) => {
    const queryValue = JSON.parse(query?.[urlParam]?.toString() || 'false')
    if (queryValue !== checked.value) {
      checked.value = queryValue
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

const setToggle = () => {
  opened.value = !opened.value
  emit('toggle', props.name)
}

onMounted(() => {
  const queryValue = JSON.parse(route.query?.[urlParam]?.toString() || 'false')
  if (queryValue) {
    checked.value = true
  } else {
    checked.value = false
  }
  if (props?.checked !== null && props?.checked !== checked.value) {
    setValue(props.checked)
  }
})
</script>
<style>
@reference "@/assets/css/main.css";

.searchfilter {
  @apply mb-3 bg-gray-50 p-5 hover:bg-gray-100;
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
}
</style>
