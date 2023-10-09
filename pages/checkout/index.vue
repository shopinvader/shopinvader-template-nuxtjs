<template>
  <NuxtLayout name="default">
    <template #header>
      <header-lite> </header-lite>
    </template>
    <main>
      <cart-checkout @next="next"></cart-checkout>
    </main>
  </NuxtLayout>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'Cart',

  setup() {
    const i18n = useI18n()
    useHead({
      title: i18n.t('cart.title')
    })
    definePageMeta({
      layout: false
    })
  },
  methods: {
    next() {
      this.$router.push('/checkout/validated')
    }
  }
})
</script>
