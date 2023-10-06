<template>
  <div class="search-loader">
    <product-hit v-for="index in 10"></product-hit>
  </div>
</template>
<script lang="ts" setup>
</script>
<style lang="scss">
.search-loader {
  @apply w-full h-full grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 mt-24;
}
</style>
