<template>
  <div class="navbar-bottom">
    <slot name="header"></slot>
    <slot name="content">
      <div class="navbar-bottom__icons">
        <nuxt-link :to="localePath('/')" class="icon">
          <div class="navlink">
            <icon class="home-icon" name="home"></icon>
            <span class="navlink__label">
              {{ $t('navbar.home') }}
            </span>
          </div>
        </nuxt-link>
        <nuxt-link :to="localePath('/search')" class="icon iconlink">
          <div class="navlink">
            <icon class="search-icon" name="search" />
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
import CartIconVue from '~/components/cart/CartIcon.vue'
import HeaderUser from '~/components/global/header/HeaderUser.vue'

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
    .router-link-active {
      @apply font-bold;
    }
    .icon {
      @apply flex w-1/4 flex-col items-center justify-center text-2xl;
      .home-icon {
        @apply mx-auto;
      }
      .search-icon {
        @apply mx-auto text-2xl;
      }
      .navlink {
        @apply rounded-md border-0 bg-white p-1 text-gray-600 hover:bg-gray-300;
        &__label {
          @apply block w-full text-center text-xs normal-case transition-all duration-100 ease-in-out;
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
