<template>
  <div class="variants">
    <div
      v-for="product in products"
      :key="product?.id || 0"
      class="variants__hit"
      @click="selectVariant(product)"
    >
      <product-image
        v-if="product?.images?.[0]"
        :image="product.images[0]"
        class="hit__image"
      >
      </product-image>
      <div class="hit__title">
        {{ product.shortName }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { Product } from '~~/models/Product'
export default {
  props: {
    variants: {
      type: Array as PropType<Product[]>,
      required: true
    }
  },
  emits: ['selectVariant'],
  computed: {
    products(): Product[] {
      return this.variants.filter((variant) => variant.id !== null)
    }
  },
  methods: {
    selectVariant(product: Product) {
      this.$emit('selectVariant', product)
    }
  }
}
</script>
<style lang="scss">
.variants {
  @apply flex flex-wrap py-2;
  &__hit {
    @apply w-1/5 pr-2;
    .hit__image {
      @apply cursor-pointer border p-2;
    }
    .hit__title {
      @apply text-center text-xs font-bold uppercase;
    }
  }
}
</style>
