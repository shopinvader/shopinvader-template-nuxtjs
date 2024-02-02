<template>

  <account-layout slug="account-profile">
    <template #content>
      <div v-if="user" class="account-profile">
        <div class="profile">
          <div class="profile-email">
            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">
                  {{ $t('account.address.email') }}
                </span>
              </label>
              <input
                type="text"
                :value="user?.login || ''"
                class="input input-bordered w-full max-w-xs"
                disabled
              />
            </div>
          </div>
          <div class="profile-email">
            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">
                    {{ $t('account.login.password') }}
                </span>
              </label>
              <input
                type="text"
                value="**********"
                class="input input-bordered w-full max-w-xs"
                disabled
              />
              <label class="label">
                <span class="label-text-alt"></span>
                <span class="label-text-alt">
                  <nuxt-link :to="{ path: '/account/password-reset', query: { email: user?.login } }" class="btn btn-link btn-xs">
                    {{ $t('account.login.forgot_password') }}
                  </nuxt-link>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </template>
  </account-layout>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'PageAccountProfile',
  setup() {
    const { t } = useI18n()
    const auth = useShopinvaderService('auth')
    const user = computed(() => auth?.getUser().value)
    definePageMeta({
      auth: true,
      pageTransition: false,
    })
    useSeoMeta({
      title: t('account.profile.title')
    })
    return {
      user
    }
  }
})
</script>
<style lang="scss">
  .account-profile {
    @apply border-b pb-4;
  }
</style>
