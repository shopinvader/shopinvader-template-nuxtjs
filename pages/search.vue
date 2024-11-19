<template>
  <search-product v-if="!refresh" ref="searchProduct" :provider="providerFunction" :query="query">
    <template #header>
      <div v-if="queryString" class="searchProduct-queryString">
        {{ t('search.autocomplete.product', { query: queryString }) }}
      </div>
    </template>
  </search-product>
</template>
<script lang="ts" setup>
import esb from 'elastic-builder'
const { t } = useI18n()
const route = useRoute()
const refresh = ref(false)

const productService = useShopinvaderService('products')
const queryString = computed(() => route.query.q)
if (queryString?.value) {
  useSeoMeta({
    title: t('search.autocomplete.product', { query: queryString?.value || '' })
  })
}
watch(queryString, () => {
  refresh.value = true
  setTimeout(() => {
    refresh.value = false
  }, 100)
})
const providerFunction = async (body: any) => {
  return (await productService?.search(body)) || null
}
const query = () => {
  const query: string | null = (route.query?.q as string) || null
  if (query !== null) {
    return productService.fullTextQuery(query)
  } else {
    const matchAllQuery = esb
      .boolQuery()
      .must(esb.matchAllQuery())
      .should(esb.termQuery('main', true))
    return matchAllQuery
  }
}
</script>
<style lang="scss">
.searchProduct-queryString {
  @apply px-6 pt-4 font-heading text-xl;
}
</style>
