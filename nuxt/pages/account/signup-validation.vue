<template>
  <AccountTokenValidation>

  </AccountTokenValidation>
</template>
<script setup lang="ts">
const auth = useAuth()
// check if a user is currently logged in and redirect to account page
try {
  const user = await auth.me()

  if (user?.value) {
    navigateTo({ path: '/account/profile' })
  }
} catch (e) {
  console.error(e)
}

definePageMeta({
  layout: "Empty",
});
</script>