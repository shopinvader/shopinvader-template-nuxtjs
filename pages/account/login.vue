<template>
  <client-only>
    <nuxt-layout v-if="user == false" name="login">
      <template #body>
        <account-login @success="goToAccount"></account-login>
      </template>
    </nuxt-layout>
    <div v-else class="flex justify-center items-center h-screen ">
      <spinner :size="40"></spinner>
      <div class="pr-3 text-xl">
        {{ $t('account.loading') }}
      </div>
    </div>
  </client-only>
</template>
<script setup lang="ts">
import { User } from '~/models';

const localePath = useLocalePath()
const { t } = useI18n()
const auth = useShopinvaderService('auth')
const user = computed(() => auth?.getUser().value)
if(auth?.type !== 'credentials') {
  /** back to home if is not auth provider credential */
  navigateTo({ path: '/' })
}
// check if a user is currently logged in and redirect to account page
const goToAccount = (value: boolean | null | User) => {
  if (value !== null && value !== false) {
    navigateTo(localePath({ path: `/account` }))
  }
}
goToAccount(user.value)
watch(user,
  (value) => {
    goToAccount(value)
  }
)
useSeoMeta({
  title: t('account.login.title')
})

definePageMeta({
  layout: false
})
</script>
