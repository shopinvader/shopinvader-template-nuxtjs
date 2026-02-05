<template>
  <div>
    <ContentRenderer v-if="page" :value="page" />
    <CatalogPage v-else/>
  </div>
</template>
<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})
</script>
