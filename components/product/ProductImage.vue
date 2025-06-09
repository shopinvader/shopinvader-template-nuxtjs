<template>
  <figure
    v-if="imageSized != null"
    :class="ui.root({ class: ['product-image', props.class]})"
    @click="onClickImage"
  >
    <NuxtImg
      :src="imageSized.src"
      :alt="imageSized.alt"
      :title="imageSized.alt"
      :class="ui.image({ class: 'product-image__image' })"
      :placeholder="img(imageSized.src, { f: 'webp', blur: 2, q: 10 })"
    />
  </figure>
</template>
<script lang="ts">
import type { ProductImage, ProductImageSet } from '#models'
import theme, { type ProductImageUI } from '~/theme/ProductImage'
export interface ProductImageProps {
  image: ProductImageSet
  class?: string
  size?: keyof ProductImageSet
  ui?: ProductImageUI
}

</script>
<script lang="ts" setup>
const props = defineProps<ProductImageProps>()
const emit = defineEmits(['click'])
const ui = computed(() => componentUI('ProductImage', theme, props.ui)({}))

const img = useImage()
const imageSized = computed((): ProductImage | null => {
  const size = props.size as keyof ProductImageSet || 'large'
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
