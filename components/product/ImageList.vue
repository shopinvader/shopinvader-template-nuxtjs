<template>
  <template v-if="slider">
    <div class="carousel w-full" style="margin-top: 30px;">
      <template v-for="(image, index) in images">
        <div :id="'item' + index" class="carousel-item w-full">
          <product-image :image="image" />
        </div>
      </template>
    </div>
    <div class="flex justify-center w-full py-2 gap-2">
      <template v-for="(image, index) in images">
        <a :href="'#item' + index" class="btn btn-xs">{{ index + 1 }}</a>
      </template>
    </div>
  </template>
  <template v-else>
    <template v-for="(image, index) in images">
      <div :id="'item' + index" class="carousel-item w-full" :class="{ 'hidden md:flex': index > 0 }">
        <product-image :image="image" />
      </div>
    </template>
  </template>
</template>

<script lang="ts">
import { ProductImageSet } from '~~/models/ProductImageSet';
import ProductImageVue from './ProductImage.vue';

export default {
  name: 'ImageListVue',
  props: {
    images: {
      type: Array<ProductImageSet>,
      required: true
    },
    slider: {
      type: Boolean
    }
  },
  components: {
    'product-image': ProductImageVue
  }
}
</script>