<template>
  <ClientOnly fallback-tag="span" fallback="Loading on server..."> </ClientOnly>
</template>
<script lang="ts">
//import { loadStripe } from '@stripe/stripe-js'
export default defineNuxtComponent({
  name: 'StripePayment',
  async setup(props, ctx) {
    const publishableKey = 'pk_test_FcNCqsbwmVR5YZ0ak2bpe1xd'
    // const stripe = await loadStripe(publishableKey)
    //console.log(stripe)
    return {
      options: {
        pk: publishableKey
      }
    }
  },
  methods: {
    tokenCreated(token: string) {
      console.log(token)
    }
  }
})
</script>
