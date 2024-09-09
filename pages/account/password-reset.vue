<template>
  <nuxt-layout name="login">
    <template #body>
      <div class="card card-body card-bordered bg-white max-w-2xl">
        <account-password-reset ></account-password-reset>
      </div>
    </template>
  </nuxt-layout>
</template>
<script setup lang="ts">
const auth = useShopinvaderService('auth')
if (auth?.type !== 'credentials') {
  /** back to home if is not auth provider credential */
  await navigateTo({ path: '/' })
}

definePageMeta({
  layout: false
})
</script>
