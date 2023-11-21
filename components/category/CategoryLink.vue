<template>
  <nuxt-link
    class="category-link"
    :to="localePath({ name: 'category', params: { slug: category.slug } })"
  >
    {{ category.name }}
  </nuxt-link>
</template>
<script lang="ts">
import { Category } from '~~/models'
import type { PropType } from 'vue'

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
  @apply badge-outline badge my-2;
}
</style>
