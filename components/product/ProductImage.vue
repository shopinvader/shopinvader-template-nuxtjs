<template>
  <figure v-if="imageSized != null">
    <img :src="imageSized.src" :alt="imageSized.alt">
  </figure>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { ProductImage } from '~~/models/ProductImage';
import { ProductImageSet } from '~~/models/ProductImageSet';

export default {
  name: 'ProductImage',
  props: {
    image: {
      type: Object as PropType<ProductImageSet>,
      required: true
    },
    size: {
      type: String as PropType<string>,
      required: false,
      default: 'large'
    }
  },
  computed: {
    imageSized(): ProductImage | null {
      return this.image?.[this.size] || null
    }
  }
}
</script>