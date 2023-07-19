<template>
  <div v-if="product">
    <ProductDetail :product="product"></ProductDetail>
  </div>
</template>
<script lang="ts" setup>
import { Product } from '~/models'

/**
 * Get Category from payload set on the route middleware
 * in the shopinvader plugin
 * */
const product: Product | null = useNuxtApp().payload?.data?.entity || null
if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}
useHead({
  title: product.name,
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: product.metaDescription || ''
    },
    {
      hid: 'keywords',
      name: 'keywords',
      content: product.metaKeywords || ''
    }
  ]
})
</script>
