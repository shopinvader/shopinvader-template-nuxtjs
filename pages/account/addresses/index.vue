<template>
  <AccountLayout slug="profile">
    <template #title>
      <div class="flex items-center py-3">
        <div class="flex flex-grow items-center">
          <icon icon="ph:address-book" class="pr-2 text-5xl"></icon>
          <h1 class="text-3xl">
            {{ $t('account.address.title') }}
          </h1>
        </div>
      </div>
    </template>
    <template #content>
      <div class="container mx-auto min-h-screen">
        <div class="py-8">
          <div class="p-2">
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
          </div>
          <client-only>
            <div v-for="a of addressTypes" :key="a">
              <address-list v-if="a == selectedType" :type="a"></address-list>
            </div>
          </client-only>
        </div>
      </div>
    </template>
  </AccountLayout>
</template>
<script lang="ts">
import AddressForm from '~~/components/address/AddressForm.vue'
import AddressList from '~~/components/address/AddressList.vue'

export default defineNuxtComponent({
  name: 'PageAccountAddresses',
  components: {
    'address-list': AddressList,
    'address-form': AddressForm
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
