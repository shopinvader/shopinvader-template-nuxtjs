<template>
  <NuxtLayout name="default">
    <template #header>
      <header-lite> </header-lite>
    </template>
    <main>
      <checkout></checkout>
    </main>
  </NuxtLayout>
</template>

<script lang="ts">
import Checkout from '~/components/cart/checkout/Checkout.vue'
export default defineNuxtComponent({
  name: 'Cart',
  components: {
    checkout: Checkout
  },
  setup() {
    const i18n = useI18n()
    useHead({
      title: i18n.t('cart.title')
    })
    definePageMeta({
      layout: false
    })
  }
})
</script>
