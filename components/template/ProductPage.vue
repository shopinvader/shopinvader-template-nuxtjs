<template>
  <div v-if="product">
    <ProductDetail :product="product"></ProductDetail>
  </div>
</template>
<script lang="ts" setup>
import type { Product } from '~/models'
const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  }
})
const product = props.product
/**
 * Get Category from payload set on the route middleware
 * in the shopinvader plugin
 * */
if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}
useHead(() => ({
  title: product.name,
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: product.metaDescription || product.shortDescription || ''
    },
    {
      hid: 'keywords',
      name: 'keywords',
      content: product.metaKeywords || ''
    }
  ]
}))
</script>
