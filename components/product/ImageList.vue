<template>
  <template v-if="slider">
    <div class="carousel w-full" style="margin-top: 30px">
      <template v-for="(image, index) in images" :key="'item' + index">
        <div :id="'item' + index" class="carousel-item w-full">
          <product-image :image="image" />
        </div>
      </template>
    </div>
    <div class="flex w-full justify-center gap-2 py-2">
      <template v-for="(image, index) in images" :key="'btn' + index">
        <a :href="'#item' + index" class="btn-xs btn">{{ index + 1 }}</a>
      </template>
    </div>
  </template>
  <template v-else>
    <template v-for="(image, index) in images" :key="'carousel' + index">
      <div
        :id="'item' + index"
        class="carousel-item w-full"
        :class="{ 'hidden md:flex': index > 0 }"
      >
        <product-image :image="image" />
      </div>
    </template>
  </template>
</template>

<script lang="ts">
import { ProductImageSet } from '~~/models/ProductImageSet'
import ProductImageVue from './ProductImage.vue'

export default {
  name: 'ImageListVue',
  components: {
    'product-image': ProductImageVue
  },
  props: {
    images: {
      type: Array<ProductImageSet>,
      required: true
    },
    slider: {
      type: Boolean
    }
  }
}
</script>
