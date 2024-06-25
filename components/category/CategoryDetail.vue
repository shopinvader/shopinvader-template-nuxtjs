<template>
  <json-viewer :data="category"></json-viewer>
  <search-product v-if="category !== null" :provider="providerFunction" :query="query">
    <template #header>
      <div class="border-b">
        <slot name="name" :category="category">
          <h1 class="mb-0">
            {{ category.name }}
          </h1>
        </slot>
        <slot name="breadcrumb" :category="category">
          <div class="breadcrumbs text-sm">
            <ul>
              <li v-for="item in breadcrumb" :key="item.id">
                <nuxt-link :to="localePath('/' + item.urlKey)">
                  {{ item.name }}
                </nuxt-link>
              </li>
            </ul>
          </div>
        </slot>
      </div>
    </template>
    <template #footer>
      <slot name="footer" :category="category">
        <div v-html="category.description"></div>
      </slot>
    </template>
  </search-product>
</template>
<script lang="ts">
import type { CategoryParent } from '#models'
import { Category } from '#models'
import esb from 'elastic-builder'
import type { PropType } from 'vue'
import JsonViewer from '~/components/debug/JsonViewer.vue'
import SearchProduct from '~/components/search/SearchProduct.vue'
import { useHistoryStore } from '~/stores/history'
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
  setup(props) {
    const localePath = useLocalePath()
    useHistoryStore()?.setLastCategory(props.category)
    return {
      localePath
    }
  },
  computed: {
    breadcrumb() {
      const localePath = useLocalePath()
      const t = useI18n().t
      let current: Category | CategoryParent | null = this.category
      const items = [current]
      while (current?.parent !== null) {
        current = current?.parent || null
        if (current?.name) {
          items.push(current)
        }
      }
      items.push(new Category({ name: t('navbar.home'), url_key: localePath({ path: '/' }) }))
      items.reverse()
      return items
    }
  },
  methods: {
    providerFunction(body: any) {
      const productService = useShopinvaderService('products')
      return productService?.search(body)
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
