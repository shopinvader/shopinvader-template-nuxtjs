<template>
  <div class="grid grid-cols-4 gap-4 py-3">
    <ProductHit v-for="product in products" :key="product.id || 0" :product="product"></ProductHit>
  </div>
  <div v-if="error" class="alert alert-error">
    {{ error }}
  </div>
</template>
<script lang="ts" setup>
import { Product } from '~/models'
let error: any = null
let products: Product[] = []
try {
  const productService = useShopinvaderService('products')
  const results = await productService.getAll()
  products = results.hits || []
} catch (e: any) {
  console.error(e)
  error = e
}
</script>
