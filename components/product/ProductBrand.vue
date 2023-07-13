<template>
  <div class="product-brand">
    <div class="product-brand__name">
      <slot name="brand">
        <NuxtLink v-if="brandSlug" :to="brandSlug">
          <span>{{ brandName }}</span>
        </NuxtLink>
        <span v-else>{{ brandName }}</span>
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
  setup(props) {
    return {
      brandName: props.product.brand?.brand?.name,
      brandSlug: props.product.brand?.brand?.description
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
