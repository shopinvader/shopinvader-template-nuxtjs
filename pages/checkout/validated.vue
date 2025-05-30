<template>
  <div class="checkout-validated">
    <template v-if="status == 'cancelled' || status == 'unknown'">
      <div class="checkout-validated__title">
        <icon name="error" />
        <span class="text-black">
          {{ $t('cart.validated.cancelled.title') }}
        </span>
      </div>
      <div class="checkout-validated__message">
        {{ $t('cart.validated.cancelled.message') }}
      </div>
      <div class="checkout-validated__link">
        <nuxt-link type="button" class="btn" :to="localePath('/checkout')">
          {{ $t('cart.validated.retry') }}
        </nuxt-link>
      </div>
    </template>
    <template v-else-if="status == 'pending' || status == 'success'">
      <div class="checkout-validated__title">
        {{ $t('cart.validated.title') }}
      </div>
      <div class="checkout-validated__intro">
        <template v-if="status == 'success'">
          <icon name="check" class="mr-2 text-6xl text-success" />
          {{ $t('cart.validated.intro') }}
        </template>
        <template v-else>
          {{ $t('cart.validated.pending') }}
        </template>
      </div>
      <div class="checkout-validated__message">
        <div v-if="status == 'pending'" v-html="pendingMessage" class="prose text-center"></div>
        <template v-else-if="status == 'success'">
          {{ $t('cart.validated.message') }}
        </template>
      </div>
      <div class="checkout-validated__link">
        <nuxt-link type="button" class="btn btn-primary" :to="localePath('/account')">
          {{ $t('cart.validated.link') }}
        </nuxt-link>
      </div>
      <div class="checkout-validated__sale">
        <sale-detail v-if="lastSale?.id" :sale="lastSale"></sale-detail>
      </div>
    </template>
    <div v-else-if="loading" class="checkout-validated__loading">
      <spinner></spinner>
    </div>
    <template v-else>
      <nuxt-link type="button" class="btn btn-primary" :to="localePath('/checkout')">
        {{ $t('btn.back') }}
      </nuxt-link>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { Sale } from '#models'
const notification = useNotification()
const { t } = useI18n()
const localePath = useLocalePath()
const loading = ref(true)
const lastSale = ref(null) as Ref<Sale | null>
const status = ref<string | null>('')
const pendingMessage = ref('') as Ref<string>
const cartService = useShopinvaderService('cart')
useHead({
  title: t('cart.validated.title')
})
onMounted(async () => {
  try {
    const route = useRoute()
    status.value = (route?.query?.status as string) || null
    loading.value = true
    lastSale.value = (await cartService?.getLastSale()) || null

    if (!status.value) {
      if (!lastSale.value?.id) {
        const router = useRouter()
        router.push(localePath('/cart'))
      }
    }
    if (route.query?.pending_message) {
      pendingMessage.value = route?.query.pending_message as string
    }
  } catch (e: any) {
    console.error(e)
    notification.addError(e?.message || t('error.generic'))
  } finally {
    loading.value = false
  }
})
</script>
<style lang="scss">
.checkout-validated {
  @apply my-10 flex flex-col items-center justify-center gap-6 py-16;
  &__title {
    @apply flex items-center gap-2 font-heading text-2xl text-primary lg:text-6xl;
    .icon {
      @apply h-14 w-14 text-error;
    }
  }
  &__intro {
    @apply flex items-center gap-2 text-center text-lg lg:text-2xl;
  }
  &__message {
    @apply card card-body card-bordered prose text-center;
  }
  &__sale {
    @apply w-full border-t px-5;
    .sale {
      @apply w-full border-0;
    }
  }
  &__loading {
    @apply flex min-h-20 items-center justify-center;
  }
}
</style>
