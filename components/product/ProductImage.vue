<template>
  <figure
    v-if="imageSized != null"
    class="product-image"
    :class="{ 'product-image--loaded': loaded }"
    @click="$emit('click')"
  >
    <img :src="imageSized.src" :alt="imageSized.alt" ref="image"/>
  </figure>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { ProductImage } from '~~/models/ProductImage'
import { ProductImageSet } from '~~/models/ProductImageSet'

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
  emits: {
    /** on click event */
    click: null
  },
  data() {
    return {
      loaded: false,
      observer: null as IntersectionObserver | null
    }
  },
  computed: {
    imageSized(): ProductImage | null {
      return this.image?.[this?.size] || null
    }
  },
  mounted() {
    const imgRef = this.$refs.image as HTMLImageElement
    if (imgRef != null) {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          this.loaded = true
          observer.unobserve(entry.target)
        }
      })
      observer.observe(imgRef)
      this.observer = observer
    }
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}
</script>
<style lang="scss">
.product-image {
  img {
    @apply h-full w-full object-contain;
  }
  &:not(.product-image--loaded) {
    @apply bg-gray-100 rounded-full animate-pulse rounded-lg;
    img {
      @apply opacity-0;
    }
  }
}
</style>
