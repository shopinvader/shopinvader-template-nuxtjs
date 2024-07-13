<template>
  <figure v-if="imageSized != null" class="product-image" :class="cssClass" @click="onClickImage">
    <NuxtImg
      :src="imageSized.src"
      :alt="imageSized.alt"
      :title="imageSized.alt"
      :placeholder="img(imageSized.src, { f: 'webp', blur: 2, q: 10 })"
    />
  </figure>
</template>
<script lang="ts" setup>
import type { ProductImage, ProductImageSet } from '#models'
import type { PropType } from 'vue'
const props = defineProps({
  image: {
    type: Object as PropType<ProductImageSet>,
    required: true
  },
  cssClass: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<string>,
    required: false,
    default: 'large'
  }
})
const emit = defineEmits(['click'])
const img = useImage()
const imageSized = computed((): ProductImage | null => {
  return props.image?.[props?.size as keyof ProductImageSet] || null
})
const onClickImage = () => {
  emit('click')
}
</script>
<style lang="scss">
.product-image {
  img {
    @apply h-full w-full object-contain;
  }
}
</style>
