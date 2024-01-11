<template>

  <account-layout slug="account-profile">
    <template #content>
      <account-profile  v-if="user" :profile="user"/>
    </template>
  </account-layout>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'PageAccountProfile',
  setup() {
    const { t } = useI18n()
    const auth = useShopinvaderService('auth')
    const user = computed(() => auth?.getUser().value)
    definePageMeta({
      auth: true
    })
    useSeoMeta({
      title: t('account.profile.title')
    })
    return {
      user
    }
  }
})
</script>
