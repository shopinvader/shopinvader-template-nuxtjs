<template>
  <client-only>
    <div class="loader">
      <spinner :size="40"></spinner>
    </div>
  </client-only>
</template>
<script setup lang="ts">
definePageMeta({
  layout: false
})
// This page is only here to show a blank page with a spinner while the user is redirected by the OIDC provider
</script>
<style lang="scss">
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
