<template>
  <Pagination :total="total" :size="size" :page="currentPage" @change="changePage" />
</template>
<script lang="ts" setup>
const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  from: {
    type: Number,
    required: true
  }
})
const emits = defineEmits(['change'])

const currentPage = computed((): number => {
  return Math.ceil(props.from / props.size) + 1
})

/**
 * changePage: display results from the given page number
 * @param from: position of the first item to display
 */
const changePage = (page: number) => {
  emits('change', (page - 1) * props.size)
}
</script>
