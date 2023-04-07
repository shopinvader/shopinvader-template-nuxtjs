<template>
  <a :href="component.link" class="section-image-banner">
    <cms-image v-if="component.defaultImage" :image="component.defaultImage" />

    <div v-if="component.content !== ''" class="section-image-banner__content">
      <h2 v-if="component.title" class="text-xl font-bold">
        {{ component.title }}
      </h2>
      <div v-html="component.content"></div>
    </div>
  </a>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { ImageBanner } from '~~/models/cms/section/ImageBanner'
import Image from '../shared/Image.vue'

export default {
  name: 'ImageBanner',
  fetchKey: 'ImageBanner',
  components: {
    'cms-image': Image
  },
  props: {
    component: {
      type: Object as PropType<ImageBanner>,
      required: true
    }
  }
}
</script>
<style lang="scss">
.section-image-banner {
  @apply relative block;
  &__content {
    @apply relative bg-base-200  p-4 text-sm md:absolute md:top-0 md:left-0 md:w-1/2 md:p-7 lg:w-96;
  }
}
</style>
