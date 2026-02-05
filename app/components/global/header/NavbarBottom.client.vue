<template>
  <div class="btm-nav">
    <slot name="header"></slot>
    <slot name="content">
      <nuxt-link :to="localePath('/') || '/'" class="iconlink">
        <icon class="h-5 w-5" name="home"></icon>
        <span class="btm-nav-label">
          {{ $t('navbar.home') }}
        </span>
      </nuxt-link>
      <nuxt-link :to="localePath('/search') || '/search'" class="iconlink">
        <icon class="h-5 w-5" name="search" />
        <span class="btm-nav-label">
          {{ $t('navbar.search') }}
        </span>
      </nuxt-link>
      <nuxt-link :to="localePath('/cart') || '/search'" class="iconlink">
        <icon class="h-5 w-5" name="cart" />
        <span class="btm-nav-label">
          {{ $t('navbar.cart') }}
        </span>
      </nuxt-link>
      <nuxt-link @click="login" class="iconlink">
        <icon class="h-5 w-5" name="user" />
        <span class="btm-nav-label">
          {{ $t('navbar.account') }}
        </span>
      </nuxt-link>
    </slot>
    <slot name="footer"></slot>
  </div>
</template>
<script lang="ts" setup>
const auth = useShopinvaderService('auth')
const login = async () => {
  const localePath = useLocalePath()
  await auth?.loginRedirect(localePath({ name: 'account' }))
}
</script>
<style lang="scss">
.btm-nav {
  @apply text-xs drop-shadow-2xl md:hidden;
  animation: navbar-slideup 0.5s ease-in-out;
}
@keyframes navbar-slideup {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
