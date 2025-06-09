<template>
  <div v-if="price !== null" :class="ui.root({ class: 'product-price' })">
    <slot name="price" :price="price">
      <div v-if="hasDiscount" :class="ui.original({ class: 'product-price__original'})">
        {{ formatCurrency(price.original_value) }}
      </div>
      <div :class="ui.value({ class: 'product-price__value'})">
        {{ formatCurrency(price.value) }}
      </div>
      <sub :class="ui.tax({ class: 'product-price__tax' })">
        <template v-if="price.tax_included">
          {{ $t('product.price.tax_included') }}
        </template>
        <template v-else>
          {{ $t('product.price.tax_excluded') }}
        </template>
      </sub>
    </slot>
  </div>
</template>
<script lang="ts">
import type { ProductPrice } from '#models'
import { formatCurrency } from '~/utils/StringHelper'
import theme from '~/theme/ProductPrice'

export type ProductPriceUi = typeof theme
export interface ProductHitProps {
  price: ProductPrice
  class?: string
  ui?: ProductPriceUi
}
</script>
<script lang="ts" setup>
const props = defineProps<ProductHitProps>()

const hasDiscount = computed(() => {
  return props.price.original_value !== props.price.value
})

const ui = computed(() => componentUI('ProductPrice', theme, props.ui)({discounted: hasDiscount.value}))

</script>
