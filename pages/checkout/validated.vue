<template>
  <div class="checkout-validated">
    <div class="checkout-validated__title">
      {{ $t('cart.validated.title') }}
    </div>
    <div class="checkout-validated__intro">
      {{ $t('cart.validated.intro') }}
    </div>
    <div class="checkout-validated__message">
      {{ $t('cart.validated.message') }}
    </div>
    <div class="checkout-validated__link">
      <nuxt-link
        type="button"
        class="btn btn-primary"
        :to=" localePath({path:'/account/sales'}) "
      >
        {{ $t('cart.validated.link') }}
      </nuxt-link>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const localePath = useLocalePath()
  const cartService = useShopinvaderService('cart')
  const cart = cartService?.getCart()
  if(!cart?.value?.id) {
    const router = useRouter()
    router.push(localePath({path: '/'}))
  } else {
    cartService.clear()
  }
</script>
<style lang="scss">
.checkout-validated {
  @apply flex flex-col gap-6 justify-center items-center py-16 my-10 border;
  &__title {
    @apply text-2xl lg:text-6xl font-heading text-primary;
  }
  &__intro {
    @apply text-lg lg:text-2xl text-center;
  }
  &__message {
    @apply prose text-center;
  }
}
</style>
