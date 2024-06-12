<template>
  <nuxt-layout name="login">
    <template #body>
      <div
        class="card card-body max-w-xl bg-white"
      >
        <account-set-new-password ></account-set-new-password>
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
