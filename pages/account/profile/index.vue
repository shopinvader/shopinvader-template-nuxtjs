<template>
    <AccountLayout slug="profile">
      <template #title>
        <div>
          {{ $t('account.profile') }}
          <span v-if="customer">
            - {{ $t('account.profile.custnum') }}
            {{ customer.ref }}
          </span>
        </div>
      </template>
      <template #content>
        <template v-if="working">
         ...
        </template>
  
        <template v-if="customer">
          <div class="profilePage-subtitle">
            {{ $t('account.profile.accountdata') }}
          </div>
          <div class="profilePage-blocs">
            <div class="profilePage-bloc">
              <div class="profilePage-subsubtitle">
                {{ $t('account.profile.contact') }}
              </div>
              <div v-if="customer">
                <div>{{ customer.displayName }}</div>
                <div>{{ customer.email }}</div>
              </div>
              <div class="profilePage-actions">
                <button class="btn btn-primary btn-small" @click="changePassword()">
                  {{ $t('account.profile.changepwd') }}
                </button>
              </div>
            </div>
            <div class="profilePage-bloc">
              <div class="profilePage-subsubtitle">
                {{ $t('account.profile.newsletter.title') }}
              </div>
              <div v-if="customer.optOut">
                {{ $t('account.profile.newsletter.unsubs') }}
                <div class="profilePage-actions">
                  <button class="btn btn-primary btn-small" @click="toggleNewsletter()">
                    {{ $t('account.profile.newsletter.subs_btn') }}
                  </button>
                </div>
              </div>
              <div v-else>
                {{ $t('account.profile.newsletter.subs') }}
                <div class="profilePage-actions">
                  <button class="btn btn-primary btn-small" @click="toggleNewsletter()">
                    {{ $t('account.profile.newsletter.unsubs_btn') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="profilePage-subtitle">
            {{ $t('account.profile.addresses.title') }}
          </div>
          <div class="profilePage-blocs">
            <div class="profilePage-bloc">
              <div class="profilePage-subsubtitle">
                {{ $t('account.profile.addresses.billing') }}
              </div>
              <!-- <AccountAddress v-if="addressInvoice" :address="addressInvoice"></AccountAddress> -->
            </div>
            <div class="profilePage-bloc">
              <div class="profilePage-subsubtitle">
                {{ $t('account.profile.addresses.delivery') }}
              </div>
              <!-- <AccountAddress v-if="addressDelivery" :address="addressDelivery"></AccountAddress> -->
            </div>
          </div>
          <div class="profilePage-actions">
            <button class="btn btn-primary btn-small" @click="requestAddressModification()">
              {{ $t('account.profile.addresses.modify_btn') }}
            </button>
          </div>
        </template>
      </template>
    </AccountLayout>
  </template>
  
  <script lang="ts">
  import AccountLayout from '~/components/account/AccountLayout.vue'
  
  export default defineNuxtComponent({
    name: 'PageAccountProfile',
    components: {
      AccountLayout
    },
    middleware: 'auth',
    data () {
      return {
        customer: null as Address, // Contains an address of type 'contact'
        addressInvoice: null as Address,
        addressDelivery: null as Address,
        working: false
      }
    },
    async mounted () {
      this.working = true
      try {
        this.customer = await this.$shopinvader.customerService.erpGetCustomer()
        const addresses = await this.$shopinvader.customerService.erpGetAddresses()
        this.addressInvoice = this.$shopinvader.customerService.getAddressOfType(addresses, 'invoice')
        this.addressDelivery = this.$shopinvader.customerService.getAddressOfType(addresses, 'delivery')
        // Use customer address by default
        if (!this.addressInvoice) {
          this.addressInvoice = this.customer
        }
        if (!this.addressDelivery) {
          this.addressDelivery = this.customer
        }
      } catch (error: any) {
        if (error.name === 'HttpErrorResponse' && error.response.status === 401) {
          this.$auth.login()
        } else {
          this.$toast.error(this.$t('error.generic') as string)
        }
      } finally {
        this.working = false
      }
    },
    methods: {
      changePassword () {
        const url = this.$config.keycloak.changePwdURL
        window.location.href = url
      },
      async toggleNewsletter () {
        try {
          this.customer = await this.$shopinvader.customerService.erpToggleOptOutCustomer(this.customer)
          this.$toast.success(this.$t('account.profile.newsletter.modify_success') as string)
        } catch (error: any) {
          if (error.name === 'HttpErrorResponse' && error.response.status === 401) {
            this.$auth.login()
          } else {
            this.$toast.error(this.$t('error.generic') as string)
          }
        }
      },
      requestAddressModification () {
        this.$router.push(this.localePath('/contact?code=CHA_AUT'))
      }
    }
  })
  </script>
  <style lang="scss">
  .profilePage {
    &-subtitle {
      @apply text-lg md:text-2xl text-primary font-sans mb-3 mt-4;
    }
    &-subsubtitle {
      @apply text-sm md:text-base font-medium uppercase mb-2;
    }
    &-blocs {
      @apply block md:flex;
      column-gap: 4rem;
    }
    &-bloc {
      vertical-align: top;
      @apply block mb-4 md:inline-block md:mb-2;
    }
    &-actions {
      @apply mb-4 mt-3 md:mb-4;
    }
  }
  </style>
  