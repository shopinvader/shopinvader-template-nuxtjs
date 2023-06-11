<template>
  <nuxt-layout name="login">
    <template #body>
      <div
        class="mx-auto rounded-3xl bg-white px-4 pt-16 md:max-w-3xl md:px-0 md:pb-52"
      >
        <div class="flex justify-center pb-4">
          <Logo></Logo>
        </div>
        <div class="mx-auto md:max-w-md">
          <account-login @success="goToAccount"></account-login>
        </div>
      </div>
    </template>
  </nuxt-layout>
</template>
<script setup lang="ts">
const auth = useShopinvaderService('auth')
// check if a user is currently logged in and redirect to account page
const goToAccount = () => {
  navigateTo({ path: `/account` })
}
try {
  const user = (await auth?.me()) || null
  if (user?.value) {
    goToAccount()
  }
} catch (e) {
  console.error(e)
}

definePageMeta({
  layout: false
})
</script>
