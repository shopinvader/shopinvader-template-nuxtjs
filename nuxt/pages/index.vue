<template>
  <div v-if="page && page?.content">
    <cms-dynamic-zone :dynamicZone="page?.content" />
  </div>
</template>
<script lang="ts" setup>
import { Page } from '~~/models/cms/Page'
const { data: page, error } = await useAsyncData('page', async () => {
  const { findPage } = useCMS()
  const page: Page | null =
    (await findPage({ filters: { handle: 'home' } })) || null
  return page
})
if (page?.value) {
  const { seo } = page.value
  useHead({
    title: seo?.metaTitle || 'Home',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: seo?.metaDescription || ''
      }
    ]
  })
}
</script>
