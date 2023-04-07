<template>
  <div v-if="component.content" class="section-textandimage">
    <div class="section-textandimage__text">
      <div v-html="component.content" />
      <div class="py-4">
        <cms-cta v-if="component.cta" :cta="component.cta"></cms-cta>
      </div>
    </div>
    <picture v-if="component.defaultImage" class="section-textandimage__img">
      <cms-image
        v-if="component.defaultImage"
        :image="component.defaultImage"
      />
    </picture>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { TextAndImage } from '~~/models/cms/section/TextAndImage'
import Image from '../shared/Image.vue'
import CTA from '../shared/CTA.vue'
export default {
  name: 'TextAndImage',
  fetchKey: 'TextAndImage',
  components: {
    'cms-image': Image,
    'cms-cta': CTA
  },
  props: {
    component: {
      type: Object as PropType<TextAndImage>,
      required: true
    }
  }
}
</script>
<style lang="scss">
.section-textandimage {
  @apply flex gap-4 py-4 md:py-8;
  &__text {
    @apply flex-1;
  }
  &__img {
    @apply flex-1;
  }
}
</style>
