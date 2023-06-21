<template>
  <div class="product-variant-selector">
    <div class="product-variant-selector__axis">
      <div
        v-for="variantAxis of product.variantSelector"
        :key="variantAxis.name"
        class="variant-axis"
      >
        <div class="variant-axis__name">
          {{ variantAxis?.name }}
        </div>
        <div class="variant-axis__values">
          <template v-if="variantAxis?.values?.length < 10">
            <div v-for="value of variantAxis?.values" :key="value.sku">
              <button
                type="button"
                class="btn-primary btn-xs btn"
                :class="{
                  'btn-outline': !value.selected
                }"
                :disabled="!value.available"
                @click="select(value.sku)"
              >
                {{ value?.name }}
              </button>
            </div>
          </template>
          <select v-else class="select-primary select select-sm max-w-xs">
            <option
              v-for="value of variantAxis?.values"
              :key="value.sku"
              :value="value.sku"
              :disabled="!value.available"
              :selected="value.selected"
              @click="select(value.sku)"
            >
              {{ value?.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Product } from '~/models'

export default defineNuxtComponent({
  emits: ['selectVariant'],
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  methods: {
    select(sku: string) {
      const variant: Product | null =
        this.product.variants?.find((variant) => variant.sku === sku) || null
      if (variant) {
        this.$emit('selectVariant', variant)
      }
    }
  }
})
</script>
<style lang="scss">
.product-variant-selector {
  &__axis {
    @apply flex flex-col gap-3 py-4;
    .variant-axis {
      &__name {
        @apply font-bold;
      }
      &__values {
        @apply flex flex-wrap gap-1;
        button {
          @apply m-1;
        }
      }
    }
  }
}
</style>
