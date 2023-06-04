<template>
  <div class="dynamic-component" :data-component="component.componentName">
    <template v-if="componentSection">
      <component :is="componentSection" :component="component" />
    </template>
    <div v-else>
      <div>Component not found</div>
      <div>{{ component.componentGroup }}/{{ component.componentName }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineAsyncComponent } from 'vue'
import { Component } from '~~/models/cms/Component'
import { PropType } from 'vue'

export default {
  name: 'DynamicComponent',
  props: {
    component: {
      type: Object as PropType<Component>,
      required: true
    }
  },
  async setup(props) {
    const component = props?.component || null
    if (!component) return { componentSection: null }
    const path = `./${component.componentGroup}/${component.componentName}.vue`
    const componentSection = defineAsyncComponent(() => import(path)) || null
    return {
      componentSection
    }
  }
}
</script>
<style lang="scss">
.dynamic-component {
}
</style>
