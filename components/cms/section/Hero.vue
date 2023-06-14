<template>
  <div v-if="component.content" class="section-hero">
    <div class="section-hero__content">
      <cms-image
        v-if="component.image"
        :image="component.image"
        class="content__img"
      />
      <div class="content__text">
        <h1 class="text-5xl font-bold">{{ component.title }}</h1>
        <p class="py-6" v-html="component.content"></p>
        <div class="py-4">
          <cms-cta v-if="component.cta" :cta="component.cta"></cms-cta>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { Hero } from '~~/models/cms/section/Hero'
import Image from '../shared/Image.vue'
import CTA from '../shared/CTA.vue'
export default {
  name: 'Hero',
  fetchKey: 'Hero',
  components: {
    'cms-image': Image,
    'cms-cta': CTA
  },
  props: {
    component: {
      type: Object as PropType<Hero>,
      required: true
    }
  }
}
</script>
<style lang="scss">
.section-hero {
  @apply hero bg-base-200 py-10;
  &__content {
    @apply hero-content flex-col gap-4 lg:flex-row;
    .content {
      &__text {
      }
      &__img {
        @apply max-w-sm rounded-lg shadow-2xl;
      }
    }
  }
}
</style>
