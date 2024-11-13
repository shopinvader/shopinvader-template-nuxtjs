<template>
  <div class="oidcRedirect">
    <spinner :size="40"></spinner>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: false
})
// This page is only here to show a blank page with a spinner
// while the OIDC provider manage the token and redirect to the right page.

// But if the user reach this page without OIDC parameters, then redirect to home page
const localePath = useLocalePath()
const router = useRouter()
onMounted(() => {
  const urlQuery = window.location.search
  if (!urlQuery.includes('code=') || !urlQuery.includes('state=')) {
    router.push(localePath({ path: '/' }))
  }
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
