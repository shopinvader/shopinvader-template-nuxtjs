<template>
  <div>
    <CmsPage v-if="cmsPage" :page="cmsPage" />
    <ProductDetail v-else-if="product" :product="product" />
    <CategoryDetail v-else-if="category" :category="category" />
  </div>
</template>
<script lang="ts" setup>
import { Product } from '~~/models'
import { Category } from '~~/models/Category'
import { Page } from '~~/models/cms/Page'

const route = useRoute()
const slugs: string[] = (route.params.slugs as string[]) || []
const path = ref((slugs.join('/') as string) || null)
let entity = ref(null as Product | Category | Page | null)
const getCmsPage = async (fullpath: string | null): Promise<Page | null> => {
  const { findPage } = useCMS()
  const cmsPage: Page | null =
    (await findPage({ filters: { fullpath } })) || null
  return cmsPage
}
const getEntity = async (
  fullpath: string | null
): Promise<Product | Category | Page | null> => {
  let entity: Product | Category | Page | null = null
  if (fullpath !== null) {
    entity = await getCmsPage(fullpath)
    if (entity !== null) {
      return entity
    }
    const services = useShopinvaderServices()
    const result = await services?.catalog?.getByURLKey(fullpath)
    if (result?.hits !== null) {
      entity = result?.hits?.[0] || null
    }
  }
  return entity
}
let { data } = await useAsyncData('entity', async () => {
  return await getEntity(path.value)
})
if (data) {
  entity = data
}
if (!entity.value) {
  entity.value = await getEntity(path.value)
}

const cmsPage = computed(() =>
  entity.value instanceof Page ? entity.value : null
)
const category = computed(() =>
  entity.value instanceof Category ? entity.value : null
)
const product = computed(() =>
  entity.value instanceof Product ? entity.value : null
)
</script>
