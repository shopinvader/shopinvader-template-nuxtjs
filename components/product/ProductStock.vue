<template>
  <slot v-if="state !== null" name="stock-status">
    <div class="stock-status">
      <div v-if="state == 'in_stock'" class="stock-status__available">
        <icon name="check" class="stock-icon" />
        <span class="stock-text">{{ t('product.stock.available') }}</span>
      </div>
      <div v-else-if="state == 'in_limited_stock'" class="stock-status__ending">
        <icon name="attention" class="stock-icon" />
        <span class="stock-text">{{ t('product.stock.ending_soon') }}</span>
      </div>
      <div v-else-if="state == 'resupplying'" class="stock-status__ending">
        <icon name="attention" class="stock-icon" />
        <span class="stock-text">{{ t('product.stock.resupplying') }}</span>
      </div>
      <div v-else-if="state == 'out_of_stock'" class="stock-status__out-of-stock">
        <icon name="entypo:cycle" class="stock-icon" />
        <span class="stock-text">{{ t('product.stock.not_available') }}</span>
      </div>
      <div v-else-if="state == 'soon_available'" class="stock-status__soon_available">
        <icon name="ph:clock" class="stock-icon" />
        <span class="stock-text">{{ t('product.stock.soon_available') }}</span>
      </div>
    </div>
  </slot>
</template>
<script lang="ts" setup>
import type { ProductStock } from '#models'
import type { PropType } from 'vue'
const { t } = useI18n()

const props = defineProps({
  stock: {
    type: Object as PropType<ProductStock>,
    required: false,
    default: () => {
      return null
    }
  }
})

const state = computed<string | null>(() => {
  let state = props.stock?.global?.state || null
  if (!state && qty) {
    state = qty.value !== null && qty.value > 0 ? 'in_stock' : 'out_of_stock'
  }
  return state
})
const qty = computed<number | null>(() => {
  return props.stock?.global?.qty || null
})
</script>
<style lang="scss">
.stock-status {
  &__available {
    @apply flex max-w-max py-1 text-sm text-primary;
    .stock-icon {
      @apply mr-1 inline text-xl text-success;
    }
    .stock-text {
      @apply text-neutral;
    }
  }
  &__ending {
    @apply flex max-w-max items-center py-1 text-sm text-primary;
    .stock-icon {
      @apply mr-1 inline text-xl text-error;
    }
    .stock-text {
      @apply text-error;
    }
  }
  &__resupplying {
    @apply flex max-w-max py-1 text-sm text-info;
    .stock-icon {
      @apply mr-1 inline-block text-xl text-error;
    }
    .stock-text {
      @apply text-error;
    }
  }
  &__out-of-stock {
    @apply flex max-w-max py-1 text-sm text-primary;
    .stock-icon {
      @apply mr-1 inline text-xl text-error;
    }
    .stock-text {
      @apply text-error;
    }
  }
  &__soon_available {
    @apply flex max-w-max py-1 text-sm text-primary;
    .stock-icon {
      @apply mr-1 inline text-xl text-error;
    }
    .stock-text {
      @apply text-error;
    }
  }
}
</style>
