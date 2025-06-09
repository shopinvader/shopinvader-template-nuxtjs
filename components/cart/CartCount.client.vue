<template>
  <div>
    <div v-if="linesCount > 0" class="cart-count">
      <template v-if="linesCount < 99">
        {{ linesCount }}
      </template>
      <template v-else> +99 </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const cartService = useShopinvaderService('cart')
  const cart = cartService?.getCart()
  const linesCount = computed((): number => {
    return cart?.value?.lines?.length || 0
  })
</script>
<style>
@reference "@/assets/css/main.css";

.cart-count {
  @apply badge badge-secondary absolute right-1 top-1 text-xs font-semibold text-white shadow-md;
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
