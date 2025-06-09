<template>
  <UBreadcrumb :items="items" />
</template>
<script lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
import { useHistoryStore } from '~/stores/history'

export interface ProductBreadcrumbProps {
  product: Product
}
</script>
<script lang="ts" setup>
const props = defineProps<ProductBreadcrumbProps>()
const { t } = useI18n()
const items = computed(() => {
  const lastCategoryId: number | null = useHistoryStore()?.lastCategory?.id || null
  const categories = props.product.categories || []
  let category: ProductCategory | null =
    categories.find((c: any) => c.findCategory(lastCategoryId)) || categories[0] || null
  const items = []
  while (category) {
    items.unshift({
      label: category.name,
      to: localePath({ path: '/' + category.urlKey })
    })
    category = category?.childs?.[0] || null
  }
  return [
    {
      label: t('navbar.home'),
      to: localePath({ path: '/' })
    },
    ...items,
    {
      label: props.product.model.name || props.product.name,
      to: localePath({ path: '/' + props.product.urlKey })
    }
  ] as BreadcrumbItem[]
})
</script>