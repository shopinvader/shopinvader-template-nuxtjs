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
  let external = false
  // Get the target page from the querystring
  const target = new URLSearchParams(window.location.search).get('target')
  let decodedTarget = target ? decodeURIComponent(target) : '/'
  // check if the target is on the same domain
  if (decodedTarget.startsWith('http')) {
    external = !decodedTarget.startsWith(window.location.origin)
    if (!external) {
      decodedTarget = decodedTarget.replace(window.location.origin, '')
    }
  }

  // Redirect to the target page
  await navigateTo(decodedTarget, { external })
})
</script>
<style lang="scss">
.oidcRedirect {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
