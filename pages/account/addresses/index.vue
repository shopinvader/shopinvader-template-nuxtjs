<template>
  <account-layout slug="account-addresses">
    <template #content>
      <div class="container mx-auto min-h-screen py-3">
        <div class="tabs">
          <div
            v-for="a of addressTypes"
            :key="a"
            class="tab-bordered tab"
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
    definePageMeta({
      auth: true
    })
    const { t } = useI18n()
    const $route = useRoute()
    const addressTypes = ['shipping', 'billing']
    const selectedType = ref($route?.query?.type || addressTypes[0])
    useSeoMeta({
      title: t(`account.address.type.${selectedType.value}`)
    })
    watch(
      () => selectedType.value,
      () => {
        useSeoMeta({
          title: t(`account.address.type.${selectedType.value}`)
        })
      }
    )
    return {
      addressTypes,
      selectedType
    }
  }
})
</script>
