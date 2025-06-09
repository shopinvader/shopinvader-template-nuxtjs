<template>
  <nuxt-link :to="localePath('/cart')" class="cart-icon">
    <div class="button">
      <icon name="cart" class="button__icon" />
      <span class="button__label">
        {{ $t('cart.title') }}
      </span>
      <span class="button-mobile__label">
        {{ $t('navbar.cart') }}
      </span>
    </div>
    <client-only>
      <lazy-cart-count />
    </client-only>
  </nuxt-link>
</template>
<script lang="ts" setup></script>
<style>
@reference "@/assets/css/main.css";

.cart-icon {
  @apply relative flex px-2 pb-5;
  .button {
    @apply btn btn-ghost flex flex-col flex-nowrap max-md:px-1 relative;
    &__icon {
      @apply text-2xl;
    }
    &__label {
      @apply absolute -bottom-5 text-xs font-normal capitalize leading-3 max-lg:hidden;
    }
    &-mobile__label {
      @apply block w-full text-center text-xs font-normal normal-case transition-all duration-100 ease-in-out md:hidden;
    }
  }

}
</style>
