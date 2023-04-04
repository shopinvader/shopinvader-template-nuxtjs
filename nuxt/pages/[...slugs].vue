<template>
  <cms-dynamic-zone v-if="cmsPage !== null" :dynamicZone="cmsPage?.content">
  </cms-dynamic-zone>
  <category-detail v-else-if="category !== null" :category="category">
  </category-detail>
  <product-detail v-else-if="product !== null" :product="product">
  </product-detail>
</template>

<script lang="ts" setup>
import { Product } from '~~/models'
import { Category } from '~~/models/Category'
import { Page } from '~~/models/cms/Page'
let category = ref(null as Category | null)
let product = ref(null as Product | null)
const route = useRoute()
const slugs: string[] = (route.params.slugs as string[]) || []
const path: string | null = (slugs.join('/') as string) || null
const { data: cmsPage, error } = await useAsyncData('cmsPage', async () => {
  const { findPage } = useCMS()
  const cmsPage: Page | null =
    (await findPage({ filters: { fullpath: path } })) || null
  return cmsPage
})
const getEntity = async (path: string): Promise<Product | Category | null> => {
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

if (cmsPage?.value) {
  const { seo } = cmsPage.value
  useHead({
    title: seo?.metaTitle || 'Home',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: seo?.metaDescription || ''
      }
    ]
  })
} else if (path !== null) {
  let entity = await getEntity(path)
  if (entity instanceof Category) {
    category.value = entity
  } else if (entity instanceof Product) {
    product.value = entity
  }
  console.log('entity', entity)
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
  }
}
</script>
