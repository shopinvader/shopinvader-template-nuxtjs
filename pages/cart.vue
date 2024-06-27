<template>
  <cart @next="submit" class="py-4">
    <template #footer>
      <product-history></product-history>
    </template>
  </cart>
</template>
<script lang="ts" setup>
const i18n = useI18n()
const cartService = useShopinvaderService('cart')
const localePath = useLocalePath()
const router = useRouter()
const cart = cartService.getCart()

useHead({
  title: i18n.t('cart.title')
})
const submit = () => {
  router.push(localePath('/checkout'))
}
</script>
<style lang="scss"></style>
