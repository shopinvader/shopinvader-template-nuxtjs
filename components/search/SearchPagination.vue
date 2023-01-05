<template>
  <div class="btn-group">
    <button v-if="currentPage > 1" class="btn btn-sm" @click="changePage(1)">
      «
    </button>
    <button
      v-if="currentPage > 1"
      class="btn btn-sm"
      @click="changePage(currentPage - 1)"
    >
      ‹
    </button>
    <button
      v-for="page in pages"
      :key="page"
      class="btn btn-sm"
      :class="{ 'btn-active': page === currentPage }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>
    <button
      v-if="currentPage < count"
      class="btn btn-sm"
      @click="changePage(currentPage + 1)"
    >
      ›
    </button>
  </div>
</template>
<script lang="ts">
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
      let pages = []
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
