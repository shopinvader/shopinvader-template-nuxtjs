<template>
  <div class="oidcRedirect">
    <spinner :size="40"></spinner>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: false
})
// This page is here to show a blank page with a spinner and redirect
// to the right page while the OIDC provider manage the token (before this).

onMounted(async () => {
  // Get the target page from the querystring
  const target = new URLSearchParams(window.location.search).get('target')
  const decodedTarget = target ? decodeURIComponent(target) : '/'
  // Redirect to the target page
  await navigateTo(decodedTarget, { replace: true })
})
</script>
<style>
@reference "@/assets/css/main.css";

.oidcRedirect {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
