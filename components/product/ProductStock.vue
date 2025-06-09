<template>
  <slot v-if="state !== null">
    <div :class="ui.root({ class: 'stock-status' })">
      <u-icon :name="icon" :class="ui.icon({ class: 'stock-icon' })"/>
      <span  :class="ui.text({ class: 'stock-text' })">{{ label }}</span>
    </div>
  </slot>
</template>
<script lang="ts">
import type { ProductStock } from '#models'
import theme from '~/theme/ProductStock'
export type ProductStockUi = typeof theme
export interface ProductStockProps {
  stock?: ProductStock
  ui?: ProductStockUi
}
</script>
<script lang="ts" setup>
const props = defineProps<ProductStockProps>()
const { t } = useI18n()
const ui = computed(() => componentUI('ProductStock', theme, props?.ui)({ state: state.value }))

const state = computed<string | null>(() => {
  const state = props.stock?.global?.state || null
  if (!state) {
    const qty = props.stock?.global?.qty || null
    if (qty?.value && qty.value > 0) {
      return 'in_stock'
    }
  }
  return state || 'out_of_stock'
})
const label = computed(() => {
  switch (state.value) {
    case 'in_stock':
      return t('product.stock.available')
    case 'in_limited_stock':
      return t('product.stock.ending_soon')
    case 'resupplying':
      return t('product.stock.resupplying')
    case 'out_of_stock':
      return t('product.stock.not_available')
    case 'soon_available':
      return t('product.stock.soon_available')  
    default:
      return ''
  }
  return t(`product.stock.${state.value}`)
})
const icon = computed(() => {
  switch (state.value) {
    case 'in_stock':
      return 'check'
    case 'in_limited_stock':
    case 'resupplying':
      return 'attention'
    case 'out_of_stock':
      return 'mdi:package-variant-remove'
    case 'soon_available':
      return 'hugeicons:package-process'
    default:
      return 'check'
  }
})
</script>
<style>
@reference "@/assets/css/main.css";

.stock-status {
  &__available {
    @apply flex max-w-max py-1 text-sm text-primary;
    .stock-icon {
      @apply mr-2 inline text-xl text-success;
    }
    .stock-text {
      @apply text-neutral;
    }
  }
  &__ending {
    @apply flex max-w-max items-center py-1 text-sm text-primary;
    .stock-icon {
      @apply mr-2 inline text-xl text-error;
    }
    .stock-text {
      @apply text-error;
    }
  }
  &__resupplying {
    @apply flex max-w-max py-1 text-sm text-info;
    .stock-icon {
      @apply mr-2 inline-block text-xl text-error;
    }
    .stock-text {
      @apply text-error;
    }
  }
  &__out-of-stock {
    @apply flex max-w-max py-1 text-sm text-primary;
    .stock-icon {
      @apply mr-2 inline text-xl text-error;
    }
    .stock-text {
      @apply text-error;
    }
  }
  &__soon_available {
    @apply flex max-w-max py-1 text-sm text-primary;
    .stock-icon {
      @apply mr-2 inline text-xl text-error;
    }
    .stock-text {
      @apply text-error;
    }
  }
  &__unknown {
    @apply flex max-w-max py-1 text-sm;
    .stock-text {
      @apply text-neutral;
    }
  }
}
</style>
