<template>
  <AccountRegister v-if="!user"> </AccountRegister>
</template>
<script setup lang="ts">
// check if a user is currently loggued in and redirect to account page
const auth = useAuth()
try {
  const user = await auth?.me()
  console.log(user)
  if(user) {
    console.log(user)
    navigateTo({ path: `/account` })
  }
} catch(e)  {
  console.error(e)
  
}
definePageMeta({
  layout: "Empty",
});
</script>