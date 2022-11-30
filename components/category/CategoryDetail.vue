<template>
  <json-viewer :data="category"></json-viewer>
  <search-product
    v-if="category !== null"
    :provider="providerFunction" 
    :query="query"
  >
    <template #header>
      <h1 class="text-3xl font-bold mb-4">
        {{ category.name }}
      </h1>
    </template>
    <template #footer>
      {{ category.description }}
    </template>
  </search-product>
  
</template>
<script lang="ts">
import SearchProduct from '~/components/search/SearchProduct.vue'
import { Category } from '~~/models/Category'
import esb from 'elastic-builder'
import { PropType } from 'vue'
import JsonViewer from '~/components/debug/JsonViewer.vue'
export default({
  name: 'categoryPage',
  components: {
    'search-product': SearchProduct,
    'json-viewer': JsonViewer
  },
  layout: "default",
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true
    }
  },
  methods: {
    providerFunction(body) {
      const services = useShopinvaderServices()
      return services.products.search(body)
    },
    query() {
      let query = esb.matchAllQuery()
      
      if(this.category !== null) {
        query = esb.nestedQuery()
          .path('categories')
          .query(
            esb.boolQuery()
              .must([
                esb.matchQuery('categories.id', this.category.id)
              ])
          )
      }
      return query
    },
  },
  
})
</script>
