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
        <div v-if="loading"  class="account-sales__loading">
          <spinner></spinner>
        </div>
        <div v-else class="account-sales__content">
          <sale-order-list :sales="sales || []" />
        </div>
        <div v-if="sales && count > 0" class="account-sales__pagination">
          <div class="form-control">
            <label class="my-1">{{ $t('pagination.showperpage') }}</label>
            <select
              v-model="perPage"
              class="select-bordered select select-sm max-w-sm"
              @change="onChangePerPage"
            >
              <option
                v-for="numPerPage in perPages"
                :key="numPerPage"
                :value="numPerPage"
              >
                {{ numPerPage }}
              </option>
            </select>
          </div>
          <pagination-status
            :per-page="perPage"
            :page="page"
            :total-items="count"
            class="mx-auto"
          ></pagination-status>
          <pagination
            :total="count"
            :size="perPage"
            :page="page"
            class="mx-auto"
            @change="onChangePage($event)"
          ></pagination>
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
  const perPages = ref([10, 20, 50])
  const localePath = useLocalePath()
  const { t } = useI18n()
  useSeoMeta({
    title: t('account.sales.title')
  })
  const perPage = ref(
    route.query.per_page ? parseInt(route.query.per_page as string) : 10
  )
  const page = ref(
    route.query.page ? parseInt(route.query.page as string) : 1
  )
  const count = ref(0)
  const sales = ref(null) as Ref<Sale[] | null>
  const loading = ref(false)

  const urlQueries = computed(() => {
    return (route.query.page +
      '|' +
      route.query.per_page +
      '|' +
      route.query.filter) as string
  })

  async function loadSales() {
    const saleService = useShopinvaderService('sales')
    loading.value = true
    try {
      const res = await saleService?.getAll(page.value, perPage.value)
      count.value = res?.count || 0
      sales.value = res?.items || []
    } catch (error: any) {
      if (
        error.name === 'HttpErrorResponse' &&
        error.response.status === 401
      ) {
        console.log('login error message')
      } else {
        console.log('generic error message')
      }
    } finally {
      loading.value = false
    }
  }

  function setRouteQueryParams() {
    router.push({
      path: localePath('/account/sales'),
      query: {
        page: '' + page.value,
        per_page: '' + perPage.value
      }
    })
  }

  function onChangePage(p: any) {
    page.value = p
    setRouteQueryParams()
  }

  function onChangePerPage() {
    page.value = 1
    setRouteQueryParams()
  }

  function navigateToSale(id: number) {
    navigateTo({ path: `/account/sales/${id}` })
  }

  onMounted(() => {
    loadSales()
  })
  watch(urlQueries, () => {
    // Update our values and reload data.
    page.value = route.query.page
      ? parseInt(route.query.page as string)
      : 1
    perPage.value = route.query.per_page
      ? parseInt(route.query.per_page as string)
      : 10

    loadSales()
  })
</script>
<style lang="scss">
.account-sales {
  &__loading {
    @apply flex justify-center items-center gap-1 p-4 py-48;
  }
  &__pagination {
    @apply py-2 flex flex-col md:flex-row justify-end gap-1 items-center border-t text-sm;
  }

}
.table {
  tr.hover {
    @apply cursor-pointer;
  }
}

.sales-table-sm {
  @apply block flex w-full md:hidden;

  &__header {
    @apply w-1/4  font-bold first-line:px-2;
  }

  &__content {
    @apply flex flex-col border-b md:hidden;
  }
  &__rows {
    @apply hover flex flex-row flex-wrap border-b py-3 cursor-pointer;
  }
  &__col {
    @apply flex w-1/2 flex-col justify-center align-middle text-sm first-letter:p-2;
  }
  &__action {
    @apply ml-auto w-full py-2;
  }
}
</style>
