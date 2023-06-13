<template>
  <nuxt-layout name="login">
    <template #body>
      <div class="rounded-3xl bg-white p-10">
        <AccountRegister v-if="!user"> </AccountRegister>
      </div>
    </template>
  </nuxt-layout>
</template>
<script setup lang="ts">
// check if a user is currently loggued in and redirect to account page
const auth = useShopinvaderService('auth')
definePageMeta({
  layout: 'Empty'
})
try {
  const user = await auth?.me()
  if (user?.value) {
    navigateTo({ path: `/account` })
  }
} catch (e) {
  console.error(e)
}
</script>
