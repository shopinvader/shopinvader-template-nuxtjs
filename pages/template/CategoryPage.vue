<template>
  <div v-if="category">
    <CategoryDetail :category="category"></CategoryDetail>
  </div>
</template>
<script lang="ts" setup>
/**
 * Get Category from payload set on the route middleware
 * in the shopinvader plugin
 * */
const category = useNuxtApp().payload?.data?.entity || null
</script>
