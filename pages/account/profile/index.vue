<template>
  <AccountLayout slug="profile">
    <template #title>
      <div class="flex items-center py-3">
        <div class="flex flex-grow items-center">
          <icon icon="mingcute:profile-line" class="pr-2 text-5xl"></icon>
          <h1 class="text-3xl">
            {{ $t('account.profile.title') }}
          </h1>
        </div>
      </div>
    </template>
    <template #content>
      <template v-if="working"> ... </template>
      <template v-if="customer">
        <div class="w-full p-2">
          <address-card :address="customer" class="h-full w-full">
            <template #actions>
              <div class="form-control w-full flex-row px-0">
                <label class="label cursor-pointer">
                  <span class="label-text mr-2 text-base">
                    {{ $t('account.profile.newsletter.title') }}</span
                  >
                  <input
                    v-model="customer.optIn"
                    type="checkbox"
                    class="toggle-primary toggle"
                    :checked="customer.optIn == true"
                    @change="toggleNewsletter"
                  />
                </label>
              </div>
              <button class="btn-primary btn-sm btn" @click="changePassword()">
                {{ $t('account.profile.changepwd') }}
              </button>
              <button
                v-if="customer.access?.update"
                class="btn-primary btn-sm btn-circle btn"
                :title="$t('actions.update')"
                @click="editedAddress = customer"
              >
                <icon icon="mdi:edit" class="text-lg text-white"></icon>
              </button>
            </template>
          </address-card>
        </div>
      </template>
    </template>
  </AccountLayout>
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
</template>

<script lang="ts">
import AccountLayout from '~/components/account/AccountLayout.vue'
import AddressCard from '~~/components/address/AddressCard.vue'
import AsideDrawer from '~~/components/global/AsideDrawer.vue'
import AddressForm from '~~/components/address/AddressForm.vue'
import { Address } from '~~/models/Address'

export default defineNuxtComponent({
  name: 'PageAccountProfile',
  components: {
    AccountLayout,
    AddressCard,
    AsideDrawer,
    AddressForm
  },
  data() {
    return {
      customer: null as Address | null, // Contains an address of type 'contact'
      working: false,
      editedAddress: null as Address | null
    }
  },
  computed: {
    optOut(): boolean {
      return this.customer?.optOut || false
    }
  },
  mounted() {
    this.getCustomer()
  },
  methods: {
    async getCustomer() {
      const services = useShopinvaderServices()
      this.working = true
      try {
        this.customer = await services?.customer?.get()
      } catch (error: any) {
      } finally {
        this.working = false
      }
    },
    async saveAddress(address: Address) {
      this.editedAddress = null
      const services = useShopinvaderServices()
      const notifications = useNotification()
      if (services?.addresses && address) {
        const addressService = services?.addresses
        try {
          if (address.id) {
            await addressService.update(address)
          } else {
            await addressService.create(address)
          }
          await this.getCustomer()
          notifications.addMessage(
            this.$t('account.address.save.success', { name: address.name })
          )
        } catch (e) {
          console.error(e)
          notifications.addError(this.$t('account.address.fetch.error'))
        }
      }
    },
    changePassword() {
      alert('Not working Yet')
    },
    async toggleNewsletter() {
      const services = useShopinvaderServices()
      const notifications = useNotification()

      try {
        await services?.customer
          ?.toggleOptOutCustomer(this.customer, {
            opt_in: this.customer?.optIn
          })
          .then((res) => {
            this.customer = res
          })
        notifications.addMessage(
          this.$t('account.profile.newsletter.modify_success') as string
        )
      } catch (error: any) {
        if (
          error.name === 'HttpErrorResponse' &&
          error.response.status === 401
        ) {
          this.$auth.login()
        } else {
          notifications.addError(this.$t('error.generic') as string)
        }
      }
    }
  }
})
</script>
