<template>

  <div class="addresses">
    <div class="addresses__list">
      <template v-if="addresses == null">
        <spinner :size="20"></spinner>
        <div class="pr-3 text-xl">
          {{ $t('account.loading') }}
        </div>
      </template>
      <template v-else-if="total == 0">
        {{ $t('address.noresult') }}
      </template>
      <div v-else class="flex-grow">
        <div class="text-2xl">
          {{ $t('address.count', { count: total }) }}
        </div>
        <div class="flex flex-wrap">
          <div
            v-for="(address, i) in addresses" :key="i"
            class="w-full md:w-1/2 lg:w-1/3 flex items-stretch"
          >
            <address-card :address="address" class="m-2 w-full">
              <template #actions>
                <button
                  v-if="address.access?.delete"
                  class="btn btn-circle btn-sm btn-primary"
                  :title="$t('actions.delete')"
                  @click="deleteAddress(address)"
                >
                  <icon icon="mdi:trash" class="text-lg text-white"></icon>
                </button>
                <button
                  v-if="address.access?.update"
                  class="btn btn-circle btn-sm btn-primary"
                  :title="$t('actions.update')"
                  @click="editedAddress=address"
                >
                  <icon icon="mdi:edit" class="text-lg text-white"></icon>
                </button>
              </template>
            </address-card>
          </div>
        </div>
        <pagination
          v-if="addresses !== null && total > addresses?.length"
          :total="total"
          :size="perPage"
          :from="from"
          @change="from = $event"
        >
        </pagination>
      </div>
    </div>
    <aside-drawer :open="editedAddress !== null" @close="editedAddress = null">
      <template #header>
        <div class="text-2xl">{{ $t('address.edit') }}</div>
      </template>
      <template #content>

        <address-form
          v-if="editedAddress"
          :address="editedAddress"
          @saved="editedAddress=null;"
        >
          <template #actions>
            <button
              type="button"
              class="btn btn-outline"
              @click="editedAddress=null;fetchAddresses()"
            >
              {{ $t('actions.close') }}
            </button>
          </template>
        </address-form>
      </template>
    </aside-drawer>
  </div>
</template>
<script lang="ts">
import { Address, AddressResult } from '~~/models/Address'
import Pagination from '~/components/global/Pagination.vue'
import AddressCard from '~/components/address/AddressCard.vue'
import AddressForm from '~/components/address/AddressForm.vue'
import AsideDrawer from '~/components/global/AsideDrawer.vue'
import { User } from 'oidc-client-ts'

export default defineNuxtComponent({
  props: {
    addressType: {
      type: String,
      required: false,
      default: 'address',
    }
  },
  components: {
    'pagination': Pagination,
    'address-form': AddressForm,
    'address-card': AddressCard,
    'aside-drawer': AsideDrawer,
  },
  data() {
    return {
      addresses: null as Address[] | null,
      total: 0,
      from: 1,
      perPage: 10,
      editedAddress: null as Address | null,
    }
  },
  computed: {
    user() {
      return useCurrentUser()
    }
  },
  watch: {
    user: {
      handler: function (user: User) {
        this.fetchAddresses(1)
      },
      immediate: true
    }
  },
  methods: {
    async fetchAddresses(from: number=1) {
      const services = useShopinvaderServices()
      const page = Math.ceil(from / this.perPage)
      const addressResult = await services?.addresses.getAll(this.perPage, page) as AddressResult

      if(addressResult !== null) {
        this.addresses = addressResult?.data || [] as Address[]
        this.total = addressResult?.size || 0
      }
    },
    async deleteAddress(address: Address) {
      if(confirm(this.$t('address.delete.confirm', { name: address.name }))) {
        const services = useShopinvaderServices()
        const addressResult = await services?.addresses.delete(address)
        if(addressResult !== null) {
          this.addresses = addressResult?.data || [] as Address[]
          this.total = addressResult?.size || 0
        }
      }
    }
  }
})
</script>
<style lang="scss">
.addresses {
  @apply flex;
  &__list {
    @apply flex-grow flex justify-center items-center py-8;
  }
  &__edit {
    @apply fixed top-0 left-0 flex justify-start items-start border;
    .edit {
      &__backdrop {
        @apply h-screen w-screen bg-black opacity-25;
      }
      &__form {
        @apply absolute p-4 bg-white shadow-xl w-1/4 h-screen overflow-y-auto;
      }
    }
  }
}
</style>
