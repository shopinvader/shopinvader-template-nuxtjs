<template>
  <div v-if="product">
    <ProductDetail :product="product"></ProductDetail>
  </div>
</template>
<script lang="ts" setup>
import { Product } from '~/models'
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
const url = useRequestURL()
const host = url.host
const protocol = url.protocol
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
    },
  ]
}))
</script>
