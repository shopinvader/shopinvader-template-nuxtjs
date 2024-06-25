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
const localePath = useLocalePath()
if (auth?.type !== 'credentials') {
  /** back to home if is not auth provider credential */
  await navigateTo(localePath('/'))
}
const { t } = useI18n()
definePageMeta({
  layout: 'empty'
})
useSeoMeta({
  title: t('account.register.title'),
  ogTitle: t('account.register.title'),
  description: t('account.register.title'),
  ogDescription: t('account.register.title')
})
const user = auth?.getUser()
if (user?.value) {
  await navigateTo(localePath('/account'))
}
</script>
