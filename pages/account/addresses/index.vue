<template>
  <account-layout slug="account-addresses">
    <template #content>
      <address-list type='delivery'></address-list>
    </template>
  </account-layout>
</template>
<script lang="ts">
import AddressForm from '~~/components/address/AddressForm.vue'
import AddressList from '~~/components/address/AddressList.vue'
import AccountLayout from '~~/components/account/AccountLayout.vue'
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
      pageTransition: false,
    })
    useSeoMeta({
      title: t('account.address.title')
    })

    return {}
  }
})
</script>
