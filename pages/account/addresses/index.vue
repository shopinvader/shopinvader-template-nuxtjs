<template>
  <account-layout slug="account-addresses">
    <template #content>
      <address-list type="delivery"></address-list>
    </template>
  </account-layout>
</template>
<script lang="ts">
import { AccountLayout, AddressForm, AddressList } from '#components'
export default defineNuxtComponent({
  name: 'PageAccountAddresses',
  components: {
    'address-list': AddressList,
    'address-form': AddressForm,
    'account-layout': AccountLayout
  },

  async setup() {
    const { t } = useI18n()
    definePageMeta({
      auth: true,
      pageTransition: false
    })
    useSeoMeta({
      title: t('account.address.title')
    })

    return {}
  }
})
</script>
