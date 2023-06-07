<template>
  <json-viewer :data="category"></json-viewer>
  <search-product
    v-if="category !== null"
    :provider="providerFunction"
    :query="query"
  >
    <template #header>
      <div class="border-b">
        <h1 class="mb-0">
          {{ category.name }}
        </h1>
        <div class="breadcrumbs text-sm">
          <ul>
            <li v-for="item in breadcrumb" :key="item.id">
              <nuxt-link :to="localePath({ path: '/' + item.urlKey })">
                {{ item.name }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
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
export default {
  name: 'CategoryPage',
  components: {
    'search-product': SearchProduct,
    'json-viewer': JsonViewer
  },
  layout: 'default',
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
  },
  computed: {
    breadcrumb() {
      const items = []
      let current = this.category
      while (current !== null) {
        items.push(current)
        current = current?.parent
      }
      items.reverse()
      return items
    }
  },
  methods: {
    providerFunction(body: any) {
      const services = useShopinvaderServices()
      return services?.products?.search(body)
    },
    query() {
      let query = esb.matchAllQuery()

      if (this?.category?.id !== null) {
        const id = this.category.id + '' // convert to string
        query = esb
          .nestedQuery()
          .path('categories')
          .query(esb.boolQuery().must([esb.matchQuery('categories.id', id)]))
      }
      return query
    }
  }
}
</script>
