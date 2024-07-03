<template>
  <div>
    <slot v-if="product || category" name="default" :entity="entity" :full-path="fullPath">
      <ProductDetail v-if="product" :product="product"></ProductDetail>
      <CategoryDetail v-else-if="category" :category="category"></CategoryDetail>
    </slot>
    <slot v-else name="fallback" :full-path="fullPath"></slot>
  </div>
</template>
<script lang="ts" setup>
// Display a product or a category page
import { Category, Product } from '~/models'

const localePath = useLocalePath()
const route = useRoute()
/** Get path without locale Prefix */
let localeRoute: string = localePath('/')
if (localeRoute == '/') {
  localeRoute = ''
}
const fullPath = route?.fullPath || ''
const path = route?.path?.replace?.(localeRoute, '').substring(1) || ''
const { data } = await useAsyncData('entity', async () => {
  const catalog = useShopinvaderService('catalog')
  const sku = route?.query?.sku?.toString() || null
  const entity = await catalog.getEntityByURLKey(path, sku)
  return entity
})
const entity = data.value
const slots = useSlots()
/** Create error if no fallback slot is set */
if (!entity && !slots?.fallback) {
  throw showError({
    statusCode: 404,
    fatal: true,
    statusMessage: 'Page Not Found: /' + path
  })
}
if (entity) {
  if (entity?.redirectUrlKey?.includes(path)) {
    /** Redirection*/
    await navigateTo(`/${entity.urlKey}`, {
      redirectCode: 301
    })
  }
  useHead(() => ({
    title: entity.name,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: entity.metaDescription || entity.shortDescription || ''
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: entity.metaKeywords || ''
      }
    ]
  }))
}
const product = computed(() => (entity instanceof Product ? entity : null))
const category = computed(() => (entity instanceof Category ? entity : null))
</script>
