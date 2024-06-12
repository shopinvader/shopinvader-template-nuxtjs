<template>
  <div v-if="product !== null" class="product-whishlist">
    <slot name="whishlist">
      <button class="btn btn-primary">Add to whishlist</button>
    </slot>
  </div>
</template>
<script lang="ts">
import { Product } from '#models'
import type { PropType } from 'vue'
export default {
  name: 'ProductWhishlist',
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  }
}
</script>
