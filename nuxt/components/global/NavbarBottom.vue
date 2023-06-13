<template>
  <div class="navbar-bottom">
    <slot name="header"></slot>
    <slot name="content">
      <div class="navbar-bottom__icons">
        <nuxt-link :to="localePath('/')" class="icon">
          <div class="navlink">
            <icon class="home-icon" icon="ph:house-simple"></icon>
            <span class="navlink__label">
              {{ $t('navbar.home') }}
            </span>
          </div>
        </nuxt-link>
        <nuxt-link :to="localePath('/search')" class="icon iconlink">
        <div class="navlink">
          <icon class="search-icon" icon="ph:magnifying-glass" />
          <span class="navlink__label">
            {{ $t('navbar.search') }}
          </span>
          </div>
        </nuxt-link>
        <div class="icon">
          <cart-icon class="cart-icon"></cart-icon>
        </div>
        <div class="icon">
          <header-user class="user-icon"></header-user>
        </div>
      </div>
    </slot>
    <slot name="footer"></slot>
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
.navbar-bottom {
  @apply fixed bottom-0 left-0 right-0 border border-t-gray-200 bg-white pb-2 pt-2;
  &__icons {
    @apply flex items-center justify-between font-normal;
    .router-link-active  {
      @apply font-bold;
    }
    .icon {
      @apply flex w-1/4 flex-col items-center justify-center text-2xl;
      .home-icon {
        @apply mx-auto;
      }
      .search-icon {
        @apply text-2xl mx-auto;
      }
      .navlink {
        @apply rounded-md bg-white text-gray-600 border-0 hover:bg-gray-300 p-1; 
        &__label {
          @apply block normal-case w-full text-center text-xs transition-all duration-100 ease-in-out;
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
}
</style>
