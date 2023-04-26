<template>
  <json-viewer :data="category"></json-viewer>
  <search-product
    v-if="category !== null"
    :provider="providerFunction"
    :query="query"
    template="row"
  >
    <template #header>
      <div class="border-b">
        <h1 class="mb-0">
          {{ category.name }}
        </h1>
        <div v-if="breadcrumb.length > 1" class="breadcrumbs text-sm">
          <ul>
            <li v-for="item in breadcrumb" :key="item.id">
              <nuxt-link :to="localePath({ path: '/' + item.urlKey })">
                {{ item.name }}
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="menu menu-horizontal w-full flex-nowrap overflow-auto pb-3">
          <nuxt-link
            v-for="item in links"
            :key="item.id"
            :to="localePath({ path: '/' + item.urlKey })"
            class="btn-ghost btn-sm btn"
          >
            {{ item.name }}
          </nuxt-link>
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
  computed: {
    breadcrumb() {
      const items = []
      let current = this.category
      while (current !== null) {
        current = current?.parent
        if (current !== null) {
          items.push(current)
        }
      }
      items.reverse()
      return items
    },
    links() {
      let links = []
      if (this.category?.parent?.urlKey) {
        links = [this.category.parent]
      }
      links = [...links, ...(this.category?.childs || [])]
      for (const item of links) {
        if (item.childs?.length > 0) {
          links = [...links, ...item.childs]
        }
      }
      return links.filter((item) => item.urlKey !== null)
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
