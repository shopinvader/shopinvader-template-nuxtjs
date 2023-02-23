<template>
  <div>
    <div v-if="loading" class="autocomplete-loading">
      <spinner></spinner>
    </div>
    <template v-else>
      <template v-if="query && searchResults.hits">
        <div class="header">
          <div class="title">
            {{ $t('search.autocomplete.product', { query }) }}
          </div>
        </div>
        <template v-if="searchResults.hits.length">
          <div class="autocomplete-products">
            <div
              v-for="product in searchResults.hits"
              class="hit"
              :key="product.id"
            >
              <product-hit
                :product="product"
                :readonly="true"
                :inline="false"
                :size="6"
              >
              </product-hit>
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="goSearchPage"
              class="btn-link text-black"
            >
              {{ $t('search.autocomplete.seeall') }}
            </button>
          </div>
        </template>
        <div v-else class="autocomplete-products">
          <div class="hit">
            {{ $t('search.autocomplete.noresults') }}
          </div>
        </div>
      </template>
      <template v-if="searchResults.hits.length < 3">
        <product-history
          :excluded-id="searchResults.hits.map((i) => i && i.id)"
        >
          <template #header>
            <div class="header">
              <div class="title">
                {{ $t('search.autocomplete.products_history') }}
              </div>
            </div>
          </template>
        </product-history>
      </template>
    </template>
  </div>
</template>
<script lang="ts">
import { Product } from '~/models'
import { ProductResult } from '~~/models/Product'
import ProductHit from '../../product/ProductHit.vue'
import ProductHistory from '../../product/ProductHistory.vue'
import Spinner from '~~/components/global/Spinner.vue'

export default {
  name: 'AutocompleteProducts',

  components: {
    'product-hit': ProductHit,
    'product-history': ProductHistory,
    Spinner
  },
  props: {
    query: {
      type: String,
      required: true
    }
  },
  emits: ['setTotal', 'setSuggestions', 'go-search'],
  setup(props, { emit }) {
    let loading = ref(false)
    let searchResults = reactive({
      hits: [] as Product[],
      suggestions: [] as any,
      total: null as number | null
    } as ProductResult)

    const onSearch = async (query: string) => {
      const productService = useShopinvaderServices()?.products || null
      loading.value = true

      if (productService) {
        const { hits, suggestions, total } =
          (await productService.autocompleteSearch(query, 6)) || null

        searchResults.hits = hits
        searchResults.suggestions = suggestions
        searchResults.total = total
        emit('setTotal', total)
        emit('setSuggestions', suggestions)
      }
      loading.value = false
    }
    watch(props, async (props) => {
      const { query = '' } = props
      if (!query) {
        searchResults.hits = []
        searchResults.suggestions = []
        searchResults.total = 0
        return
      }
      await onSearch(query)
    })
    const goSearchPage = () => {
      emit('go-search')
    }
    return {
      onSearch,
      loading,
      searchResults,
      goSearchPage
    }
  }
}
</script>
<style lang="scss">
.autocomplete-loading {
  @apply flex h-32 items-center justify-center;
}
.autocomplete-products {
  @apply grid grid-cols-2 gap-2 p-3 py-2 md:grid-cols-3;
  .hit {
    .product-hit {
      @apply flex h-full w-full rounded border text-sm;
    }
  }
}
</style>
