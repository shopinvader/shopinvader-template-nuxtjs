<template>
  <AccountLayout slug="profile">
    <template #title>
     {{ $t('account.title') }}
    </template>
    <template #content>
      test dora content  
    </template>
  </AccountLayout>
</template>
<script lang="ts">
import AccountLayout from '~/components/account/AccountLayout.vue'
  export default defineNuxtComponent({
    name: 'My account',
    components: {
      AccountLayout
    }

  })
</script>