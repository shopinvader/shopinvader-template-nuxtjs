<template>
  <div v-show="searchResults.hits.length > 0">
    <div class="header">
      <div class="title">
        {{ $t('search.autocomplete.category') }}
      </div>
    </div>
    <div class="autocomplete-category">
      <nuxt-link
        v-for="category in searchResults.hits"
        :key="category.id"
        class="autocomplete-category__hit"
        :to="localePath({ path: '/' + category.urlKey })"
      >
        {{ category.name }}
      </nuxt-link>
    </div>
  </div>
</template>
<script lang="ts">
import type { Category, CategoryResult } from '#models'
export default {
  name: 'AutocompleteCategory',
  events: ['click'],
  props: {
    query: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const localePath = useLocalePath()
    const error = ref('')
    const searchResults = reactive({
      hits: [] as Category[],
      total: null as number | null
    } as CategoryResult)

    const onSearch = async (query: string) => {
      try {
        const categoryService = useShopinvaderService('categories')
        if (categoryService) {
          const { hits, total } = (await categoryService.autocompleteSearch(query, 6)) || null
          searchResults.hits = hits
          searchResults.total = total
        }
      } catch (e) {
        error.value = e as string
      }
    }

    watch(props, async (props) => {
      const { query = '' } = props
      if (!query) {
        searchResults.hits = []
        searchResults.total = 0
        return
      }
      await onSearch(query)
    })
    return {
      localePath,
      searchResults,
      onSearch
    }
  }
}
</script>
<style lang="scss">
.autocomplete-category {
  @apply flex flex-wrap gap-2 p-2;
  &__hit {
    @apply badge badge-outline my-1;
  }
}
</style>
