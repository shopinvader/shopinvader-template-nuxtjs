<template>
  <div class="loader">
    <spinner :size="40"></spinner>
    <div class="pr-3 text-xl">
      {{ t('account.loading') }}
    </div>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
definePageMeta({
  layout: false
})
// The OIDC signinCallback management is automatically done by the auth provider, so no need to o it here.
// The only thing we need to do is to redirect to the target page.
const target = new URLSearchParams(window.location.search).get('target')
const decodedTarget = target ? decodeURIComponent(target) : '/'
await navigateTo(decodedTarget)
</script>
<style lang="scss">
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
