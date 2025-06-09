<template>
  <nuxt-layout name="login">
    <template #body>
      <div class="card card-body  max-w-2xl bg-white">
        <account-password-reset></account-password-reset>
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
  title: t('account.reset.reset_pswd'),
  ogTitle: t('account.reset.reset_pswd'),
  description: t('account.reset.description'),
  ogDescription: t('account.reset.description')
})
</script>
