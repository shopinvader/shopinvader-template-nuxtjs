<template>
  <div class="variants">
    <div
      v-for="product in variants"
      class="variants__hit"
      @click="selectVariant(product)"
    >
      <product-image
        :image="product.images[0]"
        class="hit__image"
      >
      </product-image>
      <div class="hit__title">
        {{ product.shortName }}
      </div>
      <div v-if="product.shortDescription != null">
      {{ product.shortDescription }}
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
  methods: {
    selectVariant (product: Product) {
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
      @apply border cursor-pointer p-2;
    }
    .hit__title {
      @apply text-center text-xs uppercase font-bold;
    }
  }
}
</style>