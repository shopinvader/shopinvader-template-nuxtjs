<template>
  <account-layout slug="sales">
    <template #title>
      <div class="flex items-center py-3">
        <div class="flex flex-grow items-center">
          <h1 class="text-3xl">
            {{ $t('account.sales.title') }}
          </h1>
        </div>
      </div>
    </template>
    <template #content>
      <div class="account-sales">
        <div class="account-sales__content">
          <sale-order-list />
        </div>
      </div>
    </template>

  </account-layout>
</template>

<script lang="ts" setup>
  import { Sale } from '#models'
  import { ref } from 'vue'
  definePageMeta({
    auth: true,
    pageTransition: false,
  })
  const router = useRouter()
  const route = useRoute()
  const localePath = useLocalePath()
  const { t } = useI18n()
  useSeoMeta({
    title: t('account.sales.title')
  })
</script>
<style lang="scss">
.account-sales {
  @apply card card-body card-bordered rounded-xl shadow-xl;
}
</style>
