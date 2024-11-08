<template>
  <div class="loader">
    <spinner :size="40"></spinner>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: false
})
// This page is only here to show a blank page with a spinner
// while the OIDC provider manage the token and redirect to the right page.
</script>
<style lang="scss">
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
