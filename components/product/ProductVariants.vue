<template>
  <div class="variants">
    <div
      v-for="product in products"
      :key="product?.id || 0"
      class="variants__hit"
      @click="selectVariant(product)"
      @mouseover="mouseoverVariant(product)"
      @mouseleave="mouseleaveVariant(product)"
    >
      <product-image
        v-if="product?.images?.[0]"
        :image="product.images[0]"
        :size="size"
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
import type { Product } from '#models'
import type { PropType } from 'vue'
export default {
  props: {
    variants: {
      type: Array as PropType<Product[]>,
      required: true
    },
    size: {
      type: String as PropType<string>,
      required: false,
      default: 'small'
    }
  },
  emits: ['selectVariant', 'mouseover', 'mouseleave'],
  computed: {
    products(): Product[] {
      return this.variants.filter((variant) => variant.id !== null)
    }
  },
  methods: {
    selectVariant(product: Product) {
      this.$emit('selectVariant', product)
    },
    mouseoverVariant(product: Product) {
      this.$emit('mouseover', product)
    },
    mouseleaveVariant(product: Product) {
      this.$emit('mouseleave', product)
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
