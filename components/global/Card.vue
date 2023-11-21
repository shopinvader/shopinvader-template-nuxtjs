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
import type { PropType } from 'vue'
export class CardStyle {
  shadow: boolean
  compact: boolean
  imageFull: boolean
  constructor(data: any) {
    if (Array.isArray(data)) {
      this.shadow = data?.includes('shadow') ?? false
      this.compact = data?.includes('compact') ?? false
      this.imageFull = data?.includes('imageFull') ?? false
    } else {
      this.shadow = data?.shadow ?? false
      this.compact = data?.compact ?? false
      this.imageFull = data?.imageFull ?? false
    }
  }
}
export default defineNuxtComponent({
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
})
</script>
