<template>
  <div class="checkout-validated">
    <template v-if="status == 'cancelled'">
      <div class="checkout-validated__title">
        <icon name="error" class="mr-2 text-6xl text-error" />
        <span class="text-black">
          {{ $t('cart.validated.cancelled.title') }}
        </span>
      </div>
      <div class="checkout-validated__message">
        {{ $t('cart.validated.cancelled.message') }}
      </div>
      <div class="checkout-validated__link">
        <nuxt-link
          type="button"
          class="btn"
          :to="localePath({path:`/checkout`})"
        >
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
        <div
          v-if="status == 'pending'"
          v-html="pendingMessage"
          class="prose text-center"
        ></div>
        <template v-else-if="status == 'success'">
          {{ $t('cart.validated.message') }}
        </template>
      </div>
      <div class="checkout-validated__link">
        <nuxt-link
          type="button"
          class="btn btn-primary"
          :to="localePath({path:`/account`})"
        >
          {{ $t('cart.validated.link') }}
        </nuxt-link>
      </div>
      <div class="checkout-validated__sale">
        <sale-detail v-if="lastSale?.id" :sale=lastSale></sale-detail>
      </div>
    </template>
    <div v-else-if="loading" class="checkout-validated__loading">
      <spinner></spinner>
    </div>
    <template v-else>
      <nuxt-link
        type="button"
        class="btn btn-primary"
        :to="localePath({path:`/checkout`})"
      >
        {{ $t('btn.back') }}
      </nuxt-link>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import type { Sale } from '#models';
  const notification = useNotification()
  const { t } = useI18n()
  const localePath = useLocalePath()
  const loading = ref(true)
  const lastSale = ref(null) as Ref<Sale | null>
  const status = ref('') as Ref<string>
  const pendingMessage = ref('') as Ref<string>
  const cartService = useShopinvaderService('cart')

  onMounted(async () => {
    try {
      loading.value = true
      lastSale.value = await cartService?.getLastSale() || null
      const route = useRoute()
      if(route.query?.status) {
        status.value = route.query.status as string
      } else {
        if(!lastSale.value?.id) {
          const router = useRouter()
          router.push(localePath({path: '/cart'}))
        }
      }
      if(route.query?.pending_message) {
        pendingMessage.value = route?.query.pending_message as string
      }
    } catch (e) {
      console.error(e)
      notification.addError(e?.message || t('error.generic'))
    } finally {
      loading.value = false
    }
  })
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
  &__loading {
    @apply flex justify-center items-center min-h-20;
  }
}
</style>
