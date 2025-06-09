<template>
  <div :class="ui.root({ class: 'product-tags' })">
    <slot name="tags" :product="props.product" :has-discount="hasDiscount" :discount="discount">
      <UBadge v-if="hasDiscount" :label="t('product.discount.tag', { discount })" :ui="ui?.components?.badge" />
    </slot>
  </div>
</template>
<script lang="ts">
import type { Product } from '#models'
import theme, { type ProductTagsUI } from '~/theme/ProductTags'
export interface ProductTagsProps {
  product: Product
  ui?: ProductTagsUI
}
export interface ProductTagsSlots {
  tags?: { product: Product; hasDiscount: boolean; discount: string }
}
</script>
<script lang="ts" setup>
const props = defineProps<ProductTagsProps>()
defineSlots<ProductTagsSlots>()

const { t } = useI18n()
const ui = componentUI('ProductTags', theme, props.ui)({})

const price = computed(() => {
  return props.product.price
})
const hasDiscount = computed(() => {
  if (!price.value) {
    return false
  }
  return price.value.original_value !== price.value.value
})
const discount = computed(() => {
  if (!price.value) {
    return ''
  }
  const { value, original_value } = price.value
  const discount = ((original_value - value) / original_value) * 100
  return Math.round(discount).toString()
})
</script>
