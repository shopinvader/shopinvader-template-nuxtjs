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
import { Category, Product } from '#models'
const { origin } = useRequestURL()
const localePath = useLocalePath()
const route = useRoute()
/** Get path without locale Prefix */
let localeRoute: string = localePath('/')
if (localeRoute == '/') {
  localeRoute = ''
}
const product = ref<Product | null>(null)
const category = ref<Category | null>(null)
const fullPath = route?.fullPath || ''
const path = route?.path?.replace?.(localeRoute, '').substring(1) || ''
const { data } = await useAsyncData(path, async () => {
  const catalog = useShopinvaderService('catalog')
  const sku = route?.query?.sku?.toString() || null
  const entity = await catalog.getEntityByURLKey(path, sku)
  return entity || false
})
const entity = data.value
if(entity instanceof Product) {
  product.value = entity
} else if (entity instanceof Category) {
  category.value = entity
} else {
  product.value = null
  category.value = null
}
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
  useHead({
    link: [
      {
        rel: 'canonical',
        href: `${origin}/${entity.urlKey}`
      }
    ]
  })
  useSeoMeta({
    title: entity.name,
    ogTitle: entity.name,
    description: entity.metaDescription || entity.shortDescription || '',
    ogDescription: entity.metaDescription || entity.shortDescription || '',
    keywords: entity.metaKeywords || '',
    ogImage:
      entity.images && entity.images.length > 0 && entity.images[0].medium?.src
        ? entity.images[0].medium.src
        : null
  })
}

</script>
