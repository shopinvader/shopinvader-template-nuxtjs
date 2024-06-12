<template>
  <div v-if="category">
    <CategoryDetail :category="category"></CategoryDetail>
  </div>
</template>
<script lang="ts" setup>
import { Category } from '#models'

/**
 * Get Category from payload set on the route middleware
 * in the shopinvader plugin
 * */
const category: Category | null = useNuxtApp().payload?.data?.entity || null
if (!category) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}
useHead({
  title: category.name,
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: category.metaDescription || ''
    },
    {
      hid: 'keywords',
      name: 'keywords',
      content: category.metaKeywords || ''
    }
  ]
})
</script>
