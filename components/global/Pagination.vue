<template>
  <div class="btn-group">
    <button v-if="currentPage > 1" class="btn btn-sm" @click="changePage(1)">«</button>
    <button v-if="currentPage > 1" class="btn btn-sm" @click="changePage(page - 1)">‹</button>
    <button v-for="p in pages" :key="p" class="btn btn-sm" :class="{ 'btn-active': p === page }" @click="changePage(p)">
      {{ p }}
    </button>
    <button v-if="currentPage < count" class="btn btn-sm" @click="changePage(page + 1)">›</button>
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
    page: {
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
      return this.page
    }
  },
  methods: {
    changePage(page: number) {
      this.$emit('change', page)
    }
  }
}
</script>
