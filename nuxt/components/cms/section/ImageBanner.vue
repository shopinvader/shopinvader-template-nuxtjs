<template>
  <a :href="component.link" class="section-image-banner">
    <picture class="section-image-banner">
      <cms-image
        v-if="component.defaultImage"
        :image="component.defaultImage"
      />
    </picture>
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
}
</style>
