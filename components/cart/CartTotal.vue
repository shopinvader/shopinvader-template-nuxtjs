<template>
  <div class="cart-total">
    <div class="cart-total__title">
      {{ $t('cart.total.title') }}
    </div>
  </div>
</template>
<script lang="ts">
</script>
<style lang="scss">
.cart-total {
  @apply bg-gray-100 p-4;
  &__title {
    @apply text-xl text-center;
  }
}
</style>