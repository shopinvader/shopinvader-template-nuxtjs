<template>
  <account-layout slug="account-sales">
    <template #content>
      <div class="account-sale">
        <div v-if="error" class="account-sale__error">
          {{ error }}
        </div>
        <div v-if="sale" class="account-sale__header">
          <nuxt-link :to="localePath('account-sales')" class="btn btn-link max-md:hidden">
            <icon name="left"></icon>
            {{ $t('btn.back') }}
          </nuxt-link>
          <h1>{{ $t('sale.title', {name: sale.name})  }}</h1>
        </div>
        <div v-if="sale" class="account-sale__detail">
          <sale-order-detail
            v-if="sale"
            :sale="sale"
          >
          </sale-order-detail>
        </div>
      </div>
    </template>
  </account-layout>
</template>

<script lang="ts" setup>
  import type { Sale } from '#models';
  definePageMeta({
    auth: true
  })
  const route = useRoute()
  const error = ref<Error | null>(null)
  const sale = ref<Sale | null>()
  const { t }= useI18n()
  const localePath = useLocalePath()
  try {
    const id = parseInt(route?.params?._id)
    if(id) {
      const saleService = useShopinvaderService('sales')
      sale.value = await saleService?.getById(id) || null
    }

    if(!sale.value) {
      throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
  } catch (err) {
    error.value = t('account.sales.noresult')
  }
</script>

<style lang="scss">
.account-sale {
  &__error {
    @apply alert alert-error;
  }
  &__header {
    @apply text-primary-500;
    h1 {
      @apply text-xl md:text-3xl mb-0;
    }
  }
  &__detail {
    @apply mt-4 bg-primary-50/20 md:p-4 lg:p-6;
    .detail {
      &__title {
        @apply text-3xl mb-0 bg-white md:p-4 lg:p-6 pb-0;
      }
    }
    .sale {
      @apply bg-white border-0 p-0 md:p-6;
    }
  }
}
</style>
