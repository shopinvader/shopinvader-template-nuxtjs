<template>
  <div class="product-tags">
    <div v-if="hasDiscount" class="tag">
      {{ $t('product.discount.tag', { discount }) }}
    </div>
  </div>
</template>
<script lang="ts">
import { Product } from '#models'
import type { PropType } from 'vue'
export default {
  name: 'ProductTags',
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  computed: {
    price() {
      return this.product.price
    },
    hasDiscount(): boolean {
      if (this.price === null) {
        return false
      }
      return this.price.original_value !== this.price.value
    },
    discount(): string {
      if (!this.price) {
        return ''
      }
      const { value, original_value } = this.price
      const discount = ((original_value - value) / original_value) * 100
      return Math.round(discount).toString()
    }
  }
}
</script>
<style lang="scss">
.product-tags {
  @apply flex flex-col gap-2;
  .tag {
    @apply badge badge-error font-bold;
  }
}
</style>
