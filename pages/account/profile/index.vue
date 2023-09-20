<template>
  <div class="account-profile">

  </div>
  <account-layout slug="account-profile">
    <template #content>
      {{ $t('account.profile.title') }}
      {{ user.login }}
      <template v-if="working"> ... </template>
      <template v-if="customer">
        <address-card :address="customer" class="h-full w-full">
          <template #footer>
            <div
              class="flex w-full flex-col content-center justify-center align-middle md:flex-row"
            >
              <div class="form-control w-full flex-row px-0">
                <label class="label cursor-pointer">
                  <span class="label-text mb-2 mr-2 text-base">
                    {{ $t('account.profile.newsletter.title') }}
                  </span>
                  <input
                    v-model="customer.optIn"
                    type="checkbox"
                    class="toggle-primary toggle"
                    :checked="customer.optIn == true"
                    @change="toggleNewsletter"
                  />
                </label>
              </div>
              <button
                class="btn-primary btn-sm btn mb-2 content-center align-middle md:my-2 md:mr-1"
                @click="changePassword()"
              >
                {{ $t('account.profile.changepwd') }}
              </button>
              <button
                v-if="customer.access?.update"
                class="btn-primary btn-sm btn md:btn-circle md:my-2"
                :title="$t('actions.update')"
                @click="editedAddress = customer"
              >
                <icon icon="mdi:edit" class="text-lg text-white"></icon>
              </button>
            </div>
          </template>
        </address-card>
      </template>
    </template>
  </account-layout>
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
    'account-layout': AccountLayout,
    AddressCard,
    AsideDrawer,
    AddressForm
  },
  setup() {
    const { t } = useI18n()
    const auth = useShopinvaderService('auth')
    const user = computed(() => auth?.getUser().value)
    definePageMeta({
      auth: true
    })
    useSeoMeta({
      title: t('account.profile.title')
    })
    return {
      user
    }
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
      const customerService = useShopinvaderService('customer')
      this.working = true
      try {
        this.customer = await customerService?.get()
      } catch (error: any) {
      } finally {
        this.working = false
      }
    },
    async saveAddress(address: Address) {
      this.editedAddress = null
      const addressesService = useShopinvaderService('addresses')
      const notifications = useNotification()
      if (addressesService && address) {
        try {
          if (address.id) {
            await addressesService.update(address)
          } else {
            await addressesService.create(address)
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
      const customerService = useShopinvaderService('customer')
      const notifications = useNotification()

      try {
        await customerService?.toggleOptOutCustomer(this.customer, {
          opt_in: this.customer?.optIn
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
