<template>
  <nuxt-link
    class="category-link"
    :to="{ name: localePath('category') || 'category', query: { sku: category.urlKey } }"
  >
    {{ category.name }}
  </nuxt-link>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import type { Category } from '~~/models'

export default {
  name: 'CategoryLink',
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true
    }
  },
  setup() {
    const localePath = useLocalePath()
    return {
      localePath
    }
  }
}
</script>
<style lang="scss">
.category-link {
  @apply badge badge-outline my-2;
}
</style>
