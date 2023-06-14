<template>
  <a class="btn-sm btn" :class="classList" :href="cta.link">
    {{ cta.label }}
  </a>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { CTA } from '~~/models/cms/CTA'
export default {
  name: 'CTA',
  fetchKey: 'CTA',
  props: {
    cta: {
      type: Object as PropType<CTA>,
      required: true
    }
  },
  computed: {
    classList() {
      return ['btn-' + this.cta.theme]
    }
  }
}
</script>
