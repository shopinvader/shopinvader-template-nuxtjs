<template>
  <div class="dynamic-zone">
    <dynamic-component
      v-for="section in components"
      :key="section.id"
      :component="section"
    />
  </div>
</template>
<script lang="ts">
import DynamicComponent from './DynamicComponent.vue'
import { DynamicZone } from '~~/models/cms/DynamicZone'
import { PropType } from 'vue'

export default {
  name: 'DynamicZone',
  props: {
    dynamicZone: {
      type: Object as PropType<DynamicZone>,
      required: true
    }
  },
  components: {
    'dynamic-component': DynamicComponent
  },
  computed: {
    components() {
      return (
        this.dynamicZone.components.filter(
          (component) => component?.id !== null
        ) || []
      )
    }
  }
}
</script>
<style lang="scss">
.dynamic-zone {
  @apply flex flex-col px-2;
}
</style>
