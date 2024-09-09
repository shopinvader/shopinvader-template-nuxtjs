<template>
  <div class="addresses">
    <div class="addresses__header">
      <slot name="header" :total="addresses.length">
        <div v-if="count > 4" class="header__search">
          <div class="form-control">
            <label class="label">
              <span class="label-text">
                {{ $t('account.address.search') }}
              </span>
            </label>
            <label class="input-group">
              <input
                type="text"
                :placeholder="$t('account.address.search')"
                class="input input-bordered"
                v-model="searchQuery"
                @input="searchAddress(searchQuery)"
              />
              <span>
                <icon name="mdi:magnify" class="text-lg"></icon>
              </span>
            </label>
          </div>
        </div>
        <div>
          <template v-if="addresses.length > 0">
            {{ $t('account.address.count', { count: addresses.length }) }}
          </template>
        </div>
        <button type="button" class="btn btn-primary btn-sm" @click="createAddress">
          <icon name="mdi:plus" class="text-lg"></icon>
          {{ $t('actions.create') }}
        </button>
      </slot>
    </div>
    <div class="addresses__list">
      <div v-if="errors !== null && errors.length > 0" class="w-full max-w-xl text-center">
        <div v-for="error of errors" :key="error" class="alert alert-error justify-center">
          {{ error }}
        </div>
      </div>
      <template v-else-if="loading">
        <spinner :size="20"></spinner>
        <div class="pr-3 text-xl">
          {{ $t('account.loading') }}
        </div>
      </template>
      <template v-else-if="addresses.length == 0">
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
                class="btn btn-circle btn-primary btn-sm"
                :title="$t('actions.delete')"
                @click="deleteAddress(address)"
              >
                <icon name="delete" class="text-lg text-white"></icon>
              </button>
              <button
                v-if="address.access?.update"
                class="btn btn-circle btn-primary btn-sm"
                :title="$t('actions.update')"
                @click="editedAddress = address"
              >
                <icon name="edit" class="text-lg"></icon>
              </button>
            </template>
            <template #footer>
              <slot name="address-footer" :address="address"></slot>
            </template>
          </address-card>
        </div>
      </div>
    </div>
    <aside-drawer :open="editedAddress !== null" @close="editedAddress = null">
      <template #header>
        <div class="text-2xl">{{ $t('account.address.edit') }}</div>
      </template>
      <template #content>
        <address-form v-if="editedAddress" :address="editedAddress" @saved="saveAddress">
          <template #actions>
            <button type="button" class="btn btn-outline" @click="editedAddress = null">
              {{ $t('actions.close') }}
            </button>
          </template>
        </address-form>
      </template>
    </aside-drawer>
  </div>
</template>
<script lang="ts">
import { AddressCard, AddressForm, AsideDrawer } from '#components'
import { Address } from '#models'
export default defineNuxtComponent({
  props: {
    type: {
      type: String,
      required: false,
      default: null
    }
  },
  components: {
    'address-form': AddressForm,
    'address-card': AddressCard,
    'aside-drawer': AsideDrawer
  },
  data() {
    return {
      errors: [] as string[],
      saveError: null as string | null,
      addresses: [] as Address[],
      editedAddress: null as Address | null,
      count: 0,
      loading: false,
      searchQuery: ''
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
      handler: async function () {
        await this.searchAddress()
        this.count = this.addresses.length
      },
      immediate: true
    },
    editedAddress: {
      handler: async function (value) {
        await this.searchAddress()
        this.count = this.addresses.length
      }
    }
  },
  methods: {
    async searchAddress(query?: string | null) {
      const addressService = useShopinvaderService('addresses')
      if (addressService === null) return
      const notifications = useNotification()
      try {
        this.loading = true
        this.addresses = await addressService.search(query || '')
      } catch (e) {
        console.error(e)

        this.errors.push(this.$t('account.address.fetch.error'))
        notifications.addError(this.$t('account.address.fetch.error'))
      } finally {
        this.loading = false
      }
    },
    async deleteAddress(address: Address) {
      if (confirm(this.$t('account.address.delete.confirm', { name: address.name }))) {
        this.loading = true
        const notifications = useNotification()
        const addressService = useShopinvaderService('addresses')
        if (addressService === null) return

        try {
          await addressService.delete(address)
          notifications.addMessage(
            this.$t('account.address.delete.success', { name: address.name })
          )
          this.searchAddress(this.searchQuery)
        } catch (e) {
          console.error(e)

          notifications.addError(this.$t('account.address.delete.error'))
        } finally {
          this.loading = false
        }
      }
    },
    async saveAddress(address: Address) {
      this.errors = []
      this.editedAddress = null
      const addressService = useShopinvaderService('addresses')
      const notifications = useNotification()
      if (addressService && address) {
        try {
          this.loading = true
          if (address.id) {
            await addressService.update(address)
          } else {
            await addressService.create(address)
          }
          await this.searchAddress(this.searchQuery)
          this.editedAddress = null
          this.searchAddress(this.searchQuery)
          notifications.addMessage(this.$t('account.address.save.success', { name: address.name }))
        } catch (e) {
          console.error(e)
          this.editedAddress = address
          this.saveError = this.$t('account.address.save.error')
          notifications.addError(this.$t('account.address.save.error'))
        } finally {
          this.loading = false
        }
      }
    },
    createAddress() {
      this.editedAddress = new Address({
        type: 'delivery'
      })
    }
  }
})
</script>
<style lang="scss">
.addresses {
  @apply flex flex-col;

  &__header {
    @apply flex flex-wrap items-end justify-between gap-4 border-b pb-2;
    .header {
      &__search {
        @apply flex-grow;
        .label {
          @apply pb-0;
        }
      }
    }
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
