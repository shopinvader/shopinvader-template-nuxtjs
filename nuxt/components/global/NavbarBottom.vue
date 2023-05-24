<template>
  <div
    class="fixed bottom-0 left-0 right-0 border border-t-gray-200 bg-white pb-2 pt-2"
  >
    <div class="icons">
      <nuxt-link :to="localePath('/')" class="icon">
        <icon class="home-icon" icon="ph:house-simple"></icon>
        <span class="navlink__label">
          {{ $t('navbar.home') }}
        </span>
      </nuxt-link>
      <nuxt-link :to="localePath('/search')" class="icon">
        <icon class="search-icon" icon="ph:magnifying-glass" />
        <span class="navlink__label">
          {{ $t('navbar.search') }}
        </span>
      </nuxt-link>
      <div class="icon">
        <cart-icon class="cart-icon"></cart-icon>
      </div>
      <div class="icon">
        <header-user class="user-icon"></header-user>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import CartIconVue from '../cart/CartIcon.vue'
import HeaderUser from './HeaderUser.vue'

export default {
  name: 'NavbarBottom',
  components: {
    'cart-icon': CartIconVue,
    'header-user': HeaderUser
  }
}
</script>
<style lang="scss">
.icons {
  @apply flex items-center justify-between;
  .icon {
    @apply flex w-1/4 flex-col items-center justify-center;
    .home-icon,
    .search-icon {
      @apply text-2xl;
    }
    .navlink {
      &__label {
        @apply block w-full text-center text-xs transition-all duration-100 ease-in-out;
      }
    }
    .cart-icon {
      .button {
        &__icon {
          @apply text-2xl;
        }
      }
    }
    .user-icon {
      .button {
        &__icon {
          @apply text-2xl;
        }
      }
    }
  }
}
</style>
