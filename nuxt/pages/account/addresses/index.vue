<template>
  <account-layout slug="account-addresses">
    <template #content>
      <div class="container mx-auto min-h-screen py-3">
        <div class="tabs">
          <div
            v-for="a of addressTypes"
            :key="a"
            class="tab tab-bordered"
            :class="{ 'tab-active': selectedType === a }"
            @click="selectedType = a"
          >
            {{ $t('account.address.type.' + a) }}
          </div>
        </div>

        <div v-for="a of addressTypes" :key="a">
          <address-list v-if="a == selectedType" :type="a"></address-list>
        </div>
      </div>
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
  data() {
    const $route = useRoute()
    return {
      selectedType: $route?.query?.type || ('delivery' as string | number)
    }
  },
  watch: {
    selectedType: {
      handler: function (type: string) {
        const $router = useRouter()
        const $route = useRoute()
        if (type !== null) {
          $router.push({ query: { ...$route.query, type } })
        } else {
          const query = { ...$route.query }
          delete query.type
          $router.push({ query })
        }
      },
      immediate: true
    }
  },
  async setup() {
    const addressTypes = ['delivery', 'invoice']
    return {
      addressTypes
    }
  }
})
</script>
