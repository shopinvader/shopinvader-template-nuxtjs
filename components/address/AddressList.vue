<template>
  <div class="addresses">
    <div class="addresses__header">
      <slot name="header" :total="total">
        <div>
          <template v-if="total > 0">
            {{ $t('account.address.count', { count: total }) }}
          </template>
        </div>
        <button
          type="button"
          class="btn-primary btn-sm btn"
          @click="createAddress"
        >
          <icon icon="mdi:plus" class="text-lg"></icon>
          {{ $t('actions.create') }}
        </button>
      </slot>
    </div>
    <div class="addresses__list">
      <div
        v-if="errors !== null && errors.length > 0"
        class="w-full max-w-xl text-center"
      >
        <div
          v-for="error of errors"
          :key="error"
          class="alert alert-error justify-center"
        >
          {{ error }}
        </div>
      </div>
      <template v-else-if="addresses == null">
        <spinner :size="20"></spinner>
        <div class="pr-3 text-xl">
          {{ $t('account.loading') }}
        </div>
      </template>
      <template v-else-if="total == 0">
        {{ $t('account.address.noresult') }}
      </template>
      <div v-else class="list__content">
        <div class="content__items">
          <address-card
            v-for="address in addresses"
            :key="address.id"
            :address="address"
            class="h-full w-full"
          >
            <template #header>
              <slot name="address-header" :address="address"></slot>
            </template>
            <template #actions>
              <button
                v-if="address.access?.delete"
                class="btn-primary btn-sm btn-circle btn"
                :title="$t('actions.delete')"
                @click="deleteAddress(address)"
              >
                <icon icon="mdi:trash" class="text-lg text-white"></icon>
              </button>
              <button
                v-if="address.access?.update"
                class="btn-primary btn-sm btn-circle btn"
                :title="$t('actions.update')"
                @click="editedAddress = address"
              >
                <icon icon="mdi:edit" class="text-lg text-white"></icon>
              </button>
            </template>
            <template #footer>
              <slot name="address-footer" :address="address"></slot>
            </template>
          </address-card>
        </div>
        <pagination
          v-if="addresses !== null && total > addresses?.length"
          :total="total"
          :size="perPage"
          :page="page"
          class="w-full flex-grow"
          @change="fetchAddresses($event)"
        >
        </pagination>
      </div>
    </div>
    <aside-drawer :open="editedAddress !== null" @close="editedAddress = null">
      <template #header>
        <div class="text-2xl">{{ $t('account.address.edit') }}</div>
      </template>
      <template #content>
        <address-form
          v-if="editedAddress"
          :address="editedAddress"
          @saved="saveAddress"
        >
          <template #actions>
            <button
              type="button"
              class="btn-outline btn"
              @click="editedAddress = null"
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

export default defineNuxtComponent({
  props: {
    type: {
      type: String,
      required: false,
      default: 'shipping'
    }
  },
  components: {
    pagination: Pagination,
    'address-form': AddressForm,
    'address-card': AddressCard,
    'aside-drawer': AsideDrawer
  },
  data() {
    return {
      addresses: null as Address[] | null,
      errors: [] as string[],
      total: 0,
      page: 1,
      perPage: 6,
      editedAddress: null as Address | null
    }
  },
  computed: {
    user() {
      const auth = useShopinvaderService('auth')
      return auth?.getUser()
    }
  },
  watch: {
    user: {
      handler: function () {
        this.fetchAddresses(1)
      },
      immediate: true
    }
  },
  methods: {
    async fetchAddresses(page = 1) {
      this.page = page
      const addressService = useShopinvaderService('addresses')
      if (addressService === null) return
      const notifications = useNotification()
      try {
        const addressResult = (await addressService.getAll(this.type, this.perPage, page)) as AddressResult

        if (addressResult !== null) {
          this.addresses = addressResult?.data || ([] as Address[])
          this.total = addressResult?.size || 0
        }
      } catch (e) {
        console.error(e)
        this.errors.push(this.$t('account.address.fetch.error'))
        notifications.addError(this.$t('account.address.fetch.error'))
      }
    },
    async deleteAddress(address: Address) {
      if (
        confirm(
          this.$t('account.address.delete.confirm', { name: address.name })
        )
      ) {
        const notifications = useNotification()
        const addressService = useShopinvaderService('addresses')
        if (addressService === null) return

        try {
          await addressService.delete(this.type, address)
          await this.fetchAddresses(this.page)
          notifications.addMessage(
            this.$t('account.address.delete.success', { name: address.name })
          )
        } catch (e) {
          console.error(e)
          notifications.addError(this.$t('account.address.delete.error'))
        }
      }
    },
    async saveAddress(address: Address) {
      this.editedAddress = null
      const addressService = useShopinvaderService('addresses')
      const notifications = useNotification()
      if (addressService && address) {
        try {
          if (address.id) {
            await addressService.update(this.type, address)
          } else {
            await addressService.create(this.type, address)
          }
          await this.fetchAddresses(this.page)
          notifications.addMessage(
            this.$t('account.address.save.success', { name: address.name })
          )
        } catch (e) {
          console.error(e)
          notifications.addError(this.$t('account.address.fetch.error'))
        }
      }
    },
    createAddress() {
      this.editedAddress = new Address({
        type: this.type
      })
    }
  }
})
</script>
<style lang="scss">
.addresses {
  @apply flex flex-col;

  &__header {
    @apply flex items-center justify-between px-2;
  }

  &__list {
    @apply flex flex-grow items-center justify-center  py-2;

    .list {
      &__content {
        @apply w-full flex-grow  py-4;
        .content__items {
          @apply grid gap-4 pb-4 md:grid-cols-2;
        }
      }
    }
  }

  &__edit {
    @apply fixed left-0 top-0 flex items-start justify-start;

    .edit {
      &__form {
        @apply absolute h-screen w-1/4 overflow-y-auto bg-white p-4 shadow-xl;
      }
    }
  }
}
</style>
