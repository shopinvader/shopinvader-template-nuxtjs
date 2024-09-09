<template>
  <AccountTokenValidation> </AccountTokenValidation>
</template>
<script setup lang="ts">
const auth = useShopinvaderService('auth')

if (auth?.type !== 'credentials') {
  /** back to home if is not auth provider credential */
  await navigateTo({ path: '/' })
}
// check if a user is currently logged in and redirect to account page
try {
  const user = await auth.getUser()
  if (user?.value) {
    await navigateTo({ path: '/account/profile' })
  }
} catch (e) {
  console.error(e)
}

definePageMeta({
  layout: 'Empty'
})
</script>
