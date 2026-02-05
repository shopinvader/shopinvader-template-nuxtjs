<template>
  <div>
    <cart-checkout @next="next"></cart-checkout>
  </div>
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
      layout: 'checkout'
    })
  },
  methods: {
    next() {
      const localePath = useLocalePath()
      const router = useRouter()
      router.push(localePath('/checkout/validated'))
    }
  }
})
</script>
