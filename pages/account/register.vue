<template>
  <nuxt-layout name="login">
    <template #body>
      <div>
        <AccountRegister v-if="!user"> </AccountRegister>
      </div>
    </template>
  </nuxt-layout>
</template>
<script setup lang="ts">
// check if a user is currently loggued in and redirect to account page
const auth = useShopinvaderService('auth')
if(auth?.type !== 'credentials') {
  /** back to home if is not auth provider credential */
  navigateTo({ path: '/' })
}
const { t } = useI18n()
definePageMeta({
  layout: 'Empty'
})
useSeoMeta({
  title: t('account.register.title'),
  ogTitle: t('account.register.title'),
  description: t('account.register.title'),
  ogDescription: t('account.register.title')
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
