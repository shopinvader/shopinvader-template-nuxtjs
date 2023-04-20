<template>
  <img :src="fullpath" :alt="alt" :title="title" />
</template>
<script lang="ts">
import { PropType } from 'vue'
import { Image } from '~/models/cms/Image'
export default {
  props: {
    image: {
      type: Object as PropType<Image>,
      required: true
    },
  },
  computed: {
    fullpath() {
      const { strapi } = useRuntimeConfig()
      const baseURl = strapi?.url || ''
      return baseURl + this.image.url
    },
    alt() {
      return this.image?.alternativeText || ''
    },
    title() {
      return this.image?.alternativeText || ''
    }
  }
}
</script>
