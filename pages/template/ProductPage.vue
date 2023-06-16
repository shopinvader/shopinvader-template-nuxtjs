<template>
  <div v-if="product">
    <ProductDetail :product="product"></ProductDetail>
  </div>
</template>
<script lang="ts" setup>
/**
 * Get Category from payload set on the route middleware
 * in the shopinvader plugin
 * */
const product = useNuxtApp().payload?.data?.entity || null
</script>
