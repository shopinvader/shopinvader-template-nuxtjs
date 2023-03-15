<template>
  <div>
    <category-detail v-if="category !== null" :category="category">
    </category-detail>
    <product-detail v-else-if="product !== null" :product="product">
    </product-detail>
  </div>
</template>
<script lang="ts">
import CategoryDetail from '~~/components/category/CategoryDetail.vue'
import ProductDetail from '~~/components/product/ProductDetail.vue'
import { Category } from '~~/models/Category'
import { Product } from '~~/models/Product'

export default {
  name: 'CategoryPage',
  components: {
    'category-detail': CategoryDetail,
    'product-detail': ProductDetail
  },
  layout: 'default',
  async setup() {
    const route = useRoute()
    let category = ref(null as Category | null)
    let product = ref(null as Product | null)

    const slugs: string[] = (route.params.slugs as string[]) || []
    const path: string | null = (slugs.join('/') as string) || null

    const getEntity = async (
      path: string
    ): Promise<Product | Category | null> => {
      let entity: Product | Category | null = null
      if (path !== null) {
        const services = useShopinvaderServices()
        const result = await services?.catalog?.getByURLKey(path)
        if (result?.hits !== null) {
          entity = result?.hits?.[0] || null
        }
      }
      return entity
    }

    if (path !== null) {
      try {
        let entity = await getEntity(path)
        if (entity instanceof Category) {
          category.value = entity
        } else if (entity instanceof Product) {
          product.value = entity
        }
        if (entity) {
          useHead({
            title: entity?.name,
            meta: [
              {
                name: 'description',
                content: entity?.metaDescription || ''
              }
            ]
          })
        } else {
          throw createError({ statusCode: 404, message: 'Page not found' })
        }
      } catch (error) {
        throw createError({ statusCode: 500, message: error || 'error' })
      }
    }
    return {
      product,
      category
    }
  }
}
</script>
