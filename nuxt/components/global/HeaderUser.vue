<template>
  <div class="header-user">
    <div class="dropdown-end dropdown">
      <div tabindex="0" class="button" @click="signin">
        <Icon icon="clarity:user-line" class="button__icon" />
        <span class="button__label">
          {{ user?.name || $t('account.title') }}
        </span>
      </div>
      <ul v-if="user" tabindex="0" class="dropdown-content">
        <li>
          <nuxt-link to="/account">
            {{ $t('account.title') }}
          </nuxt-link>
        </li>
        <li>
          <button type="button" @click="logout">
            {{ $t('account.logout') }}
          </button>
        </li>
        <li>
          <nuxt-link to="/account/addresses">
            {{ $t('account.address.title') }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
export default defineNuxtComponent({
  name: 'HeaderUser',
  computed: {
    user() {
      return useCurrentUser() || null
    }
  },
  methods: {
    async signin() {
      !this.user && (await useAuth()?.login())
    },
    async logout() {
      await useAuth()?.logout()
    },
    async info() {
      await useAuth()?.getUser()
    }
  }
})
</script>
<style lang="scss">
.header-user {
  @apply relative flex;
  .dropdown-content {
    @apply menu rounded-box w-64  bg-base-100 shadow;
  }
  .button {
    @apply btn-ghost btn flex flex-col flex-nowrap  max-md:px-1;
    &__icon {
      @apply text-2xl;
    }
    &__label {
      @apply absolute -bottom-5 text-xs font-normal capitalize leading-3 max-lg:hidden;
    }
  }
}
</style>
