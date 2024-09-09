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
<script lang="ts" setup>
import type { CategoryParent } from '#models'
import { Category } from '#models'
import esb from 'elastic-builder'
import type { PropType } from 'vue'

import { useHistoryStore } from '~/stores/history'
const props = defineProps({
  category: {
    type: Object as PropType<Category>,
    required: true
  }
})
const localePath = useLocalePath()

const breadcrumb = computed(() => {
  const t = useI18n().t
  let current: Category | CategoryParent | null = props.category
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
})

const providerFunction = (body: any) => {
  const productService = useShopinvaderService('products')
  return productService?.search(body)
}

const query = () => {
  let query = esb.matchAllQuery()

  if (props?.category?.id !== null) {
    const id = props.category.id + '' // convert to string
    query = esb
      .nestedQuery()
      .path('categories')
      .query(
        esb
          .boolQuery()
          .must([esb.matchQuery('categories.id', id)])
          .should(esb.termQuery('main', true))
      )
  }
  return query
}

onMounted(() => {
  useHistoryStore()?.setLastCategory(props.category)
})
</script>
