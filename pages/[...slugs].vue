<template>
  <div>
    <CategoryDetail v-if="category !== null" :category="category"></CategoryDetail>
    <ProductDetail v-else-if="product !== null" :product="product"></ProductDetail>
    <page-not-found-error v-else></page-not-found-error>
  </div>
</template>
<script lang="ts">
import PageNotFoundError from '~~/components/global/PageNotFoundError.vue'
import CategoryDetail from '~~/components/category/CategoryDetail.vue'
import ProductDetail from '~~/components/product/ProductDetail.vue'

import { Category } from '~~/models/Category'

import { Product } from '~~/models/Product'
export default({
  name: 'categoryPage',
  layout: "default",
  components: {
    
    'page-not-found': PageNotFoundError,
    'category-detail': CategoryDetail,
    'product-detail': ProductDetail
  },
  async setup() {
    const route = useRoute()
    let category = ref(null as  Category | null)
    let product = ref(null as Product  | null)

    const slugs:string[] = route.params.slugs as string[] || []
    const path:string | null = slugs.join('/')  as string || null


    const getEntity = async (path):Promise<Product | Category | null> => {
      let entity:Product | Category = null
      if(path !== null) {
        const services = useShopinvaderServices()
        const result = await services.catalog.getByURLKey(path)
        if(result?.hits !== null) {
          entity = result?.hits[0]
          
        }
      }
      return entity
    }
    
    if(path !== null) {
      let entity = await getEntity(path)
      if(entity instanceof Category) {
        category.value = entity
      } else if(entity instanceof Product) {
        product.value = entity
      }
      useHead({
        title: entity?.name,
        meta: [
          {
            name: 'description',
            content: entity?.metaDescription || ''
          }
        ]
      })
    }
    return {
      product,
      category
    }
  }
})
</script>
