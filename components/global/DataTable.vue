<template>
  <div class="data-table">
    <div class="data-table__header">
      <slot name="header">
        {{ $t('table.count', { count: totalCount }) }}
      </slot>
    </div>
    <div class="data-table__content">
      <table class="table" :class="classTable">
        <thead>
          <tr>
            <th v-for="col in columns">
              <slot :name="`${col.key}-header`" :column="col" :search="search">
                {{ col?.label || '' }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length">
              <div class="data-table__loading">
                <spinner></spinner>
              </div>
            </td>
          </tr>
          <tr v-else-if="error">
            <td :colspan="columns.length">
              <div class="data-table__error">
                {{ error }}
              </div>
            </td>
          </tr>
          <tr v-else-if="lines.length === 0">
            <td :colspan="columns.length" class="text-center">
              {{ $t('table.noresult') }}
            </td>
          </tr>
          <tr v-else v-for="row in lines" :key="row.id">
            <td v-for="col in columns" :class="col.class">
              <slot :name="`${col.key}-data`" :row="row" :search="search">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
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
            <option v-for="size in sizeList">
              {{ size }}
            </option>
          </select>
        </label>
        <pagination
          :total="totalCount"
          :size="size"
          :page="page"
          @change="changePage"
        >
        </pagination>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface TableColumn {
  label: string;
  key: string;
  class?: string;
}
const emit = defineEmits(['change-pagination'])
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
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: 0,
  },
  sizeList: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 50]
  }
})
const loading = ref(props.loading)
const error = ref('')
const size = ref(props.sizeList[0])
const page = ref(1)
const lines = ref([]) as Ref<any[]>
const totalCount = ref(props.count)
const changePage = (p: number) => {
  page.value = p
}
const search = async () => {
  if (props.search) {
    try {
      loading.value = true
      const hits:any = await props.search(page.value, size.value)

      totalCount.value = hits?.count || 0
      lines.value = hits?.rows || []

    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }
}
watch(() => props.rows, (rows) => {
  console.log('rows', rows)
  lines.value = rows
}, { immediate: true })
watch(() => props.count, (count) => {
  console.log('count', count)
  totalCount.value = count
})
watch([page, size], () => {
  emit('change-pagination', {
    page: page.value,
    size: size.value
  })
  search()
})

onMounted(() => {
  search()
})
</script>
<style lang="scss">
.data-table {
  @apply overflow-x-auto w-full flex flex-col gap-2;
  &__content {

  }
  &__loading {
    @apply flex justify-center py-10 w-full;
  }
  &__error {
    @apply alert alert-error m-5;
  }
  &__footer {
    @apply flex justify-between items-end;
  }

}
</style>
