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
        class="hit__image"
        :class="{'hit__image--selected': selected === product.id}"
      >
      </product-image>
      <div class="hit__title">
        {{ product.shortName }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import { Product } from '#models'
export default {
  props: {
    variants: {
      type: Array as PropType<Product[]>,
      required: true
    }
  },
  emits: ['selectVariant', 'mouseover', 'mouseleave'],
  computed: {
    products(): Product[] {
      return this.variants.filter((variant) => variant.id !== null)
    }
  },
  data() {
    return {
      selected: null as number | null
    }
  },
  methods: {
    selectVariant(product: Product) {
      this.selected = product.id
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
      &--selected {
        @apply border-primary;
      }
    }
    .hit__title {
      @apply text-center text-xs font-bold uppercase;
    }
  }
}
</style>
