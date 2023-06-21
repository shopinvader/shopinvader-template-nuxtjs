<template>
  <div class="header-user">
    <div class="dropdown-end dropdown">
      <button type="button" tabindex="0" class="button" @click="next">
        <Icon icon="clarity:user-line" class="button__icon" />
        <span class="button__label">
          {{ user?.name || $t('account.title') }}
        </span>
        <span class="button_mobile__label">
          {{ $t('navbar.account') }}
        </span>
      </button>
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
<script lang="ts" setup>
const auth = useShopinvaderService('auth')
const user = auth?.getUser()
const router = useRouter()
const next = () => {
  if (user?.value) {
    router.push('/account')
  } else {
    router.push('/account/login')
  }
}
const logout = () => {
  auth?.logout()
  navigateTo('/')
}
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
      @apply absolute -bottom-5 line-clamp-2 text-xs font-normal capitalize leading-3 max-lg:hidden;
    }
    &_mobile__label {
      @apply block w-full text-center text-xs font-normal normal-case transition-all duration-100 ease-in-out md:hidden;
    }
  }
}
</style>
