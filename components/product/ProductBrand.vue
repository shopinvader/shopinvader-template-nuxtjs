<template>
  <div class="product-brand">
    <div class="product-brand__name">
      <slot name="brand">
        <NuxtLink v-if="brandLink" :to="brandLink">
          <span>{{ productBrandName }}</span>
        </NuxtLink>
        <span v-else>{{ productBrandName }}</span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Product } from '~~/models/Product'

export default defineNuxtComponent({
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  computed: {
    productBrandName(): string {
      const brand = this.product?.brand
      const brandName = brand?.brand.name || ''
      return brandName
    },
    brandLink(): string {
      const brand = this.product?.brand
      const brandSlug = brand?.brand.description || ''
      return brandSlug
    }
  }
})
</script>

<style lang="scss">
.product-brand {
  @apply mb-2 flex flex-row items-start justify-start;
  &__name {
    @apply text-xl font-bold text-zinc-500;
  }
}
</style>
