<template>
  <div class="data-table">
    <div class="data-table__header">
      <slot name="header" :rows="lines" :count="totalCount" :search="search">
        {{ $t('table.count', { count: totalCount }) }}
      </slot>
    </div>
    <div class="data-table__content">
      <table class="table" :class="classTable">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">
              <slot :name="`${col.key}-header`" :column="col" :search="search">
                {{ col?.label || '' }}
              </slot>
            </th>
          </tr>
          <progress v-if="loading" class="table__loading"></progress>
        </thead>
        <tbody>
          <tr v-if="error">
            <td :colspan="columns.length">
              <div class="data-table__error">
                {{ error }}
              </div>
            </td>
          </tr>
          <tr v-else-if="lines.length === 0 && !loading">
            <td :colspan="columns.length" class="text-center">
              {{ $t('table.noresult') }}
            </td>
          </tr>
          <tr v-else v-for="row in lines" :key="row.id" class="data-line" @click="onClickRow(row)">
            <td v-for="col in columns" :key="col.key" class="data-line__cell" :class="col.class">
              <span class="cell__label">
                <slot :name="`${col.key}-header`" :column="col" :search="search">
                  {{ col?.label || '' }}
                </slot>
              </span>
              <span class="cell__value">
                <slot :name="`${col.key}-data`" :row="row" :count="count" :search="search">
                  {{ row[col.key] }}
                </slot>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <slot name="content" :rows="lines" :count="totalCount" :search="search"> </slot>
    </div>
    <div class="data-table__footer">
      <slot name="footer">
        <label class="form-control">
          <div class="label">
            <span class="label-text">
              {{ $t('table.size') }}
            </span>
          </div>
          <select v-model="size" class="select select-bordered select-sm">
            <option v-for="sizeItem in sizeList" :key="sizeItem">
              {{ sizeItem }}
            </option>
          </select>
        </label>
        <pagination :total="totalCount" :size="size" :page="page" @change="changePage">
        </pagination>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface TableColumn {
  label: string
  key: string
  class?: string
}
const emit = defineEmits(['change-pagination', 'click'])
const props = defineProps({
  classTable: {
    type: String,
    default: ''
  },
  columns: {
    type: Array as PropType<TableColumn[]>,
    required: true
  },
  rows: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => []
  },
  search: {
    type: Function as PropType<(page: number, size: number) => void>,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: 0
  },
  sizeList: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 50]
  },
  autoRefresh: {
    type: Boolean,
    default: false
  }
})
let timer: any = null
const loading = ref(props.loading)
const error = ref('')
const size = ref(props.sizeList[0])
const page = ref(1)
const lines = ref([]) as Ref<any[]>
const totalCount = ref(props.count)
const { start, finish } = useLoadingIndicator({
  duration: 2000,
  throttle: 200
})
const changePage = (p: number) => {
  page.value = p
}
const search = async () => {
  if (props.search) {
    try {
      loading.value = true
      const hits: any = await props.search(page.value, size.value)

      totalCount.value = hits?.count || 0
      lines.value = hits?.rows || []
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }
}
const onClickRow = (row: any) => {
  emit('click', row)
}
watch(loading, (loading) => {
  if (loading) {
    start()
  } else {
    finish()
  }
})
watch(
  () => props.rows,
  (rows) => {
    lines.value = rows
  },
  { immediate: true }
)
watch(
  () => props.count,
  (count) => {
    totalCount.value = count
  }
)
watch([size], () => {
  page.value = 1
})
watch([page], () => {
  emit('change-pagination', {
    page: page.value,
    size: size.value
  })
  search()
})

const doAutoRefresh = async () => {
  await search()
  timer = setTimeout(async () => {
    await doAutoRefresh()
  }, 10000)
}

onMounted(() => {
  search()
  if (props.autoRefresh) {
    doAutoRefresh()
  }
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>
<style lang="scss">
.data-table {
  @apply flex w-full flex-col gap-2 overflow-x-auto;
  &__content {
    .table {
      thead {
        @apply relative max-lg:hidden;
      }
      tbody {
        @apply gap-3 max-lg:flex max-lg:w-full max-lg:flex-col;
        tr.data-line {
          @apply w-full gap-1 max-lg:card max-lg:card-bordered hover:bg-gray-50 max-lg:grid max-lg:grid-cols-2;
          .data-line__cell {
            @apply flex-col max-lg:flex max-lg:py-1;
            .cell {
              &__label {
                @apply text-xs text-gray-600 lg:hidden;
              }
            }
          }
        }
      }
      &__loading {
        @apply progress absolute h-1 w-full p-0;
      }
    }
  }
  &__loading {
    @apply flex w-full justify-center py-10 transition-all duration-100 ease-in;
  }
  &__error {
    @apply alert alert-error m-5;
  }
  &__footer {
    @apply flex items-end justify-between;
  }
}
</style>
