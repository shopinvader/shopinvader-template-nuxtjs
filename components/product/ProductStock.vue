<template>
  <slot v-if="state !== null" name="stock-status">
    <div class="stock-status">
      <div v-if="state == 'in_stock'" class="stock-status__available">
        <icon icon="mdi:check" class="stock-icon " />
        <span class="stock-text">{{ $t('product.stock.available') }}</span>
      </div>
      <div v-else-if="state == 'in_limited'" class="stock-status__ending ">
        <icon icon="iconamoon:attention-circle-thin" class="stock-icon" />
        <span class="stock-text">{{ $t('product.stock.ending_soon') }}</span>
      </div>
      <div v-else-if="state == 'resupplying'" class="stock-status__ending ">
        <icon icon="iconamoon:attention-circle-thin" class="stock-icon" />
        <span class="stock-text">{{ $t('product.stock.resupplying') }}</span>
      </div>
      <div
        v-else-if="state == 'out_of_stock'"
        class=" stock-status__out-of-stock"
      >
        <icon icon="entypo:cycle" class="stock-icon" />
        <span class="stock-text">{{ $t('product.stock.not_available') }}</span>
      </div>
    </div>
  </slot>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import type { ProductStock } from '#models'

export default {
  name: 'ProductStock',
  props: {
    stock: {
      type: Object as PropType<ProductStock>,
      required: true,
      default: () => {
        return null
      }
    }
  },
  computed: {
    state(): string | null {
      let state = this.stock?.global?.state || null
      if (!state && this.qty) {
        state = this.qty > 0 ? 'in_stock' : 'out_of_stock'
      }
      return state
    },
    qty():number | null  {
      return this.stock?.global?.qty || null
    }
  }
}
</script>
<style lang="scss">
.stock-status {
  &__available{
    @apply  text-primary max-w-max text-sm py-1;
      .stock-icon {
        @apply text-success text-xl inline mr-1;
      }
      .stock-text {
        @apply text-neutral;
      }
  }
  &__ending {
    @apply text-primary max-w-max  text-sm py-1;

    .stock-icon {
        @apply text-error text-xl inline mr-1;
      }
      .stock-text {
        @apply text-error;
      }
  }
  &__resupplying{
    @apply text-info max-w-max  text-sm py-1;
    .stock-icon {
        @apply text-error text-xl inline mr-1;
      }
      .stock-text {
        @apply text-error;
      }
  }
  &__out-of-stock{
    @apply text-primary max-w-max  text-sm py-1;
    .stock-icon {
        @apply text-error text-xl inline mr-1;
      }
      .stock-text {
        @apply text-error;
      }
  }

}
</style>
