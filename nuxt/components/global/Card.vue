<template>
  <div class="card bg-base-100" :class="classList">
    <figure>
      <slot name="figure"></slot>
    </figure>
    <div class="card-body">
      <slot name="body"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { CardStyle } from '~/models/cms/Card'
export default {
  name: 'Card',
  props: {
    style: {
      type: Object as PropType<CardStyle>,
      default: () => {
        return new CardStyle(null)
      }
    }
  },
  computed: {
    classList() {
      return {
        'shadow-2xl rounded-lg': this.style.shadow,
        'card-compact': this.style.compact,
        'image-full': this.style.imageFull
      }
    }
  }
}
</script>
