<template>
  <div class="header-user" :class="{'header-user--logged': user}">
    <button type="button" tabindex="0" class="button" @click="next">
      <Icon :icon="!user ? 'clarity:user-line' : 'clarity:user-solid'" class="button__icon" />
      <span class="button__label">
        {{ user?.name || $t('account.title') }}
      </span>
      <span class="button_mobile__label">
        {{ $t('navbar.account') }}
      </span>
    </button>
  </div>
</template>
<script lang="ts" setup>
const auth = useShopinvaderService('auth')
const user = auth?.getUser()
const next = () => {
  auth?.loginRedirect()
}
</script>
<style lang="scss">

.header-user {
  @apply relative flex;
  &--logged {
    .button {
      &__label {
        @apply text-secondary;
      }
    }
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
