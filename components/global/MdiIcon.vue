<template>
  <span class="mdi-icon w-5 ">
    <svg version="1.1" viewBox="0 0 24 24"><path :d="icon" /></svg>
  </span>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MdiIcon',
  props: {
    icon: {
      type: String,
      required: true
    }
  }
})
</script>
<style lang="scss">
.mdi-icon {
  display: inline-block;
  vertical-align: bottom;
  svg {
    fill: currentColor;
  }
}
</style>
