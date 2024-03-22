<template>
  <div class="checkout-validated">
    <div class="checkout-validated__title">
      {{ $t('cart.validated.title') }}
    </div>
    <div class="checkout-validated__intro">
      <icon name="check" class="mr-2 text-6xl text-success" />
      {{ $t('cart.validated.intro') }}
    </div>
    <div class="checkout-validated__message">
      {{ $t('cart.validated.message') }}
    </div>
    <div class="checkout-validated__link">
      <nuxt-link
        type="button"
        class="btn btn-primary"
        :to=" localePath({path:`/account`}) "
      >
        {{ $t('cart.validated.link') }}
      </nuxt-link>
    </div>
    <div class="checkout-validated__sale">
      <sale-detail v-if="lastSale?.id" :sale=lastSale></sale-detail>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const localePath = useLocalePath()
  const cartService = useShopinvaderService('cart')
  const lastSale = cartService?.getLastSale() || null
  if(!lastSale?.id) {
    const router = useRouter()
    router.push(localePath({path: '/cart'}))
  }
</script>
<style lang="scss">
.checkout-validated {
  @apply flex flex-col gap-6 justify-center items-center py-16 my-10;
  &__title {
    @apply text-2xl lg:text-6xl font-heading text-primary;
  }
  &__intro {
    @apply text-lg lg:text-2xl text-center items-center flex gap-2;
  }
  &__message {
    @apply prose text-center;
  }
  &__sale {
    @apply w-full px-5 border-t;
    .sale {
      @apply w-full border-0;
    }
  }
}
</style>
