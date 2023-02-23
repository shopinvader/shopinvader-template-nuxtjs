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
import { Category, CategoryResult } from '~~/models/Category'
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
    let searchResults = reactive({
      hits: [] as Category[],
      total: null as number | null
    } as CategoryResult)

    const onSearch = async (query: string) => {
      const categoryService = useShopinvaderServices()?.categories || null

      if (categoryService) {
        const { hits, total } =
          (await categoryService.autocompleteSearch(query, 6)) || null

        searchResults.hits = hits
        searchResults.total = total
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
    @apply badge-outline badge my-1;
  }
}
</style>
