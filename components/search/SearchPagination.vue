<template>
  <Pagination
    :total="total"
    :size="size"
    :page="currentPage"
    @change="changePage"
  />
</template>
<script lang="ts">
import Pagination from '../global/Pagination.vue'

export default {
  name: 'SearchPagination',
  props: {
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
  },
  emits: ['change'],
  computed: {
    count(): number {
      return Math.ceil(this.total / this.size)
    },
    pages(): number[] {
      const pages = []
      for (let i = this.currentPage - 2; i < this.currentPage; i++) {
        if (i > 0) {
          pages.push(i)
        }
      }
      pages.push(this.currentPage)
      for (let i = 1; i < 3; i++) {
        if (this.currentPage + i <= this.count) {
          pages.push(this.currentPage + i)
        }
      }
      return pages
    },
    currentPage(): number {
      return Math.ceil(this.from / this.size) + 1
    }
  },
  methods: {
    changePage(page: number) {
      this.$emit('change', (page - 1) * this.size)
    }
  }
}
</script>
