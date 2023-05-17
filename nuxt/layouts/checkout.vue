<template>
  <div>
    <NuxtLayout name="default">
      <template #header v-if="page !== '/cart'">
        <header-lite> </header-lite>
      </template>
      <main>
        <div class="checkout">
          <div class="checkout__step">
            <ul class="cart-steps">
              <li
                v-for="step in steps"
                :key="step.link"
                class="step"
                :class="{ 'step--active': step.active }"
              >
                <nuxt-link :to="{ path: step.link }">
                  {{ step.title }}
                </nuxt-link>
              </li>
            </ul>
          </div>
          <template v-if="lineCount > 0">
            <div class="checkout__header">
              <slot name="header"></slot>
            </div>
            <div class="checkout__body">
              <slot name="body">
                <div class="flex w-full justify-center py-24">
                  <spinner-vue></spinner-vue>
                </div>
              </slot>
            </div>
          </template>
          <template v-else>
            <div class="checkout__empty">
              <slot v-if="cart?.loaded" name="empty">
                <icon icon="ph:bag" class="text-6xl text-gray-300"></icon>
                <div class="text-3xl">
                  {{ $t('cart.empty') }}
                </div>
                <nuxt-link :to="{ path: '/' }" class="btn-primary btn">
                  {{ $t('cart.continue') }}
                </nuxt-link>
              </slot>
              <spinner-vue v-else></spinner-vue>
            </div>
          </template>
        </div>
        <code>
          <pre>{{ cart }}</pre>
        </code>
      </main>
    </NuxtLayout>
  </div>
</template>
<script>
import HeaderLite from '~/components/global/HeaderLite.vue'
import Spinner from '~/components/global/Spinner.vue'
export default defineNuxtComponent({
  components: {
    'header-lite': HeaderLite,
    'spinner-vue': Spinner
  },
  setup() {
    const i18n = useI18n()
    const service = useShopinvaderServices()
    const route = useRoute()
    const page = route.fullPath
    const cart = service?.cart?.getCart() || ref(null)
    let steps = [
      {
        title: i18n.t('cart.title'),
        link: '/cart',
        active: false,
        layout: 'default'
      },
      {
        title: i18n.t('cart.address.title'),
        link: '/cart/address',
        active: false,
        layout: 'empty'
      },
      {
        title: i18n.t('cart.payment.title'),
        link: '/cart/payment',
        active: false,
        layout: 'empty'
      },
      {
        title: 'Confirmation',
        link: '/confirmation',
        active: false
      }
    ]
    definePageMeta({
      layout: false
    })
    steps = steps.map((step) => {
      step.active = step.link === page
      return step
    })
    const lineCount = computed(() => {
      return cart?.value?.lines?.length || 0
    })
    return {
      steps,
      page,
      lineCount,
      cart
    }
  }
})
</script>
<style lang="scss">
.checkout {
  @apply container mx-auto min-h-screen py-5;
  &__step {
    @apply hidden w-full border-b pb-2 md:block;
    .cart-steps {
      @apply flex w-full flex-row justify-center pb-4 md:gap-8;
      .step {
        @apply text-center font-light uppercase text-gray-400;
        &--active {
          @apply font-bold text-primary;
        }
        &:not(:last-child)::after {
          content: '-';
          @apply pl-4 font-light text-gray-400;
        }
      }
    }
  }
  &__header {
    @apply py-4 text-xl;
  }
  &__empty {
    @apply flex w-full flex-col items-center justify-center gap-4  py-32 text-center;
  }
}
</style>
