<template>
  <AccountRegister v-if="!user"> </AccountRegister>
</template>
<script setup lang="ts">
// check if a user is currently loggued in and redirect to account page
const auth = useAuth()
try {
  const user = await auth?.me()
  if(user?.value) {
    navigateTo({ path: `/account` })
  }
} catch(e)  {
  console.error(e)
  
}
definePageMeta({
  layout: "Empty",
});
</script>