<template>
  <figure v-if="imageSized != null" class="product-image" :class="cssClass" @click="onClickImage">
    <NuxtImg
      :src="imageSized.src"
      :alt="imageSized.alt"
      :title="imageSized.alt"
      :placeholder="img(imageSized.src, { f: 'webp', blur: 4, q: 10})"
      sizes="sm:150px md:214px lg:260px"
      :width="260"
      :height="252"
      format="webp"
      :quality="3"
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
  const size = props.size as keyof ProductImageSet
  const image = props.image?.[size] || null
  // Replace spaces with %20
  if (image?.src) {
    image.src = image.src.replace(/ /g, '%20')
  }
  return image
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
