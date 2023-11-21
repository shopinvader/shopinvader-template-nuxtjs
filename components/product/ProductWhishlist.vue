<template>
  <div v-if="product !== null" class="product-whishlist">
    <slot name="whishlist">
      <button class="btn-primary btn">Add to whishlist</button>
    </slot>
  </div>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import { Product } from '#models'
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
