<template>
  <div class="account-profile">
    <slot name="header" :profile="profile"></slot>
    <slot name="login" :profile="profile">
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
              :value="profile?.login || ''"
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
                <nuxt-link
                  :to="{
                    path: localePath('/account/password-reset'),
                    query: { email: profile?.login }
                  }"
                  class="btn btn-link btn-xs"
                >
                  {{ $t('account.login.forgot_password') }}
                </nuxt-link>
              </span>
            </label>
          </div>
        </div>
      </div>
    </slot>
    <slot name="profile" :profile="profile"> </slot>
  </div>
</template>
<script lang="ts">
import type { User } from '#models'
export default defineNuxtComponent({
  name: 'account-profile',
  props: {
    profile: {
      required: true,
      type: Object as PropType<User>
    }
  },
  setup() {
    return {
      localePath
    }
  }
})
</script>
<style lang="scss">
.account-profile {
  @apply border-b pb-4;
}
</style>
