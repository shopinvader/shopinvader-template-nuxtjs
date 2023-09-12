<template>
  <account-layout slug="sales">
    <template #title>
      <div class="flex items-center py-3">
        <div class="flex flex-grow items-center">
          <icon
            icon="material-symbols:view-list-rounded"
            class="pr-2 text-5xl"
          ></icon>
          <h1 class="text-3xl">
            {{ $t('account.sales.title') }}
          </h1>
        </div>
      </div>
    </template>
    <template v-if="sales" #content>
      <template v-if="loading"> ... </template>
      <div class="overflow-x-auto">
        <table v-if="sales" class="table hidden w-full md:table">
          <thead>
            <tr>
              <th class="px-2 text-left">
                {{ $t('account.sales.table_labels.ordernum') }}
              </th>
              <th class="px-2 text-left">
                {{ $t('account.sales.table_labels.orderdate') }}
              </th>
              <th class="px-2 text-left">
                {{ $t('account.sales.table_labels.pricenet') }}
              </th>
              <th class="px-2 text-left">
                {{ $t('account.sales.table_labels.status') }}
              </th>
              <th class="px-2 text-right">
                {{ $t('account.sales.table_labels.action') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="sales.length === 0">
              <tr>
                <td colspan="100%">
                  {{ $t('account.emptylist') }}
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="sale in sales"
                :key="'' + sale.id"
                @click="navigateToSale(sale.id)"
                class="hover"
              >
                <td class="p-2 text-left text-sm">
                  {{ sale.name }}
                </td>
                <td class="p-2 text-left text-sm">
                  <template v-if="sale.date">
                    {{ sale.date.toLocaleDateString($i18n.locale) }}
                  </template>
                </td>
                <td class="p-2 text-left text-sm">
                  <span v-if="sale.amount">{{
                    $filter.currency(sale.amount.total)
                  }}</span>
                </td>
                <td class="p-2 text-left text-sm">
                  <span class="badge-primary badge badge-md px-3 text-xs">{{
                    sale.stateLabel
                  }}</span>
                </td>
                <td class="p-2 text-right text-sm">
                  <div
                    class="flex justify-end text-primary md:whitespace-nowrap"
                  >
                    <NuxtLink :to="`/account/sales/${sale.id}`">
                      <icon
                        icon="material-symbols:chevron-right"
                        class="mr-2 text-2xl font-bold text-primary"
                      ></icon>
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <div class="sales-table-sm__content">
          <template v-if="sales.length === 0">
            <div class="w-full">
              <div colspan="100%">
                {{ $t('account.emptylist') }}
              </div>
            </div>
          </template>
          <template v-else>
            <div
              v-for="sale in sales"
              :key="'' + sale.id"
              class="sales-table-sm__rows"
            >
              <div class="sales-table-sm__col">
                <div>
                  <span class="mx-1">
                    {{ $t('account.sales.table_labels.ordernum') }}
                  </span>
                  <span>
                    {{ sale.name }}
                  </span>
                </div>
                <div v-if="sale.date" class="my-1 text-lg font-bold">
                  {{ sale.date.toLocaleDateString($i18n.locale) }}
                </div>
                <div class="border-l-4 border-primary px-2">
                  <span class="badge badge-xs p-2 text-xs">
                    {{ sale.stateLabel }}
                  </span>
                </div>
              </div>
              <div class="sales-table-sm__col">
                <div
                  v-if="sale.amount"
                  class="flex justify-end align-middle text-lg"
                >
                  {{ $filter.currency(sale.amount.total) }}

                  <icon
                    icon="material-symbols:chevron-right"
                    class="mr-2 text-2xl font-bold text-primary"
                    @click="navigateToSale(sale.id)"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div v-if="count > 0" class="flex flex-col py-3">
        <div class="form-control ml-auto max-w-xs">
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
    </template>
  </account-layout>
</template>

<script lang="ts">
import AccountLayout from '~/components/account/AccountLayout.vue'
import Pagination from '~/components/global/Pagination.vue'
import PaginationStatus from '~/components/global/PaginationStatus.vue'
import { Sale } from '~/models/Sale'
import { ref } from 'vue'

export default defineNuxtComponent({
  name: 'PageAccountSales',
  components: {
    'account-layout': AccountLayout,
    pagination: Pagination,
    'pagination-status': PaginationStatus
  },
  setup(props) {
    definePageMeta({
      auth: true
    })
    const router = useRouter()
    const route = useRoute()
    const perPages = ref([10, 20, 50])
    const localePath = useLocalePath()

    const perPage = ref(
      route.query.per_page ? parseInt(route.query.per_page as string) : 10
    )
    const page = ref(
      route.query.page ? parseInt(route.query.page as string) : 1
    )
    const count = ref(0)
    const sales = ref(null)
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
        const res = await saleService?.getSalesList(page.value, perPage.value)
        count.value = res.count
        sales.value = res.sales
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

    function onChangePage(page: any) {
      page.value = page
      setRouteQueryParams()
    }

    function onChangePerPage() {
      page.value = 1
      setRouteQueryParams()
    }

    function navigateToSale(id) {
      navigateTo({ path: `/account/sales/${id}` })
    }

    onMounted(() => {
      loadSales()
    })

    return {
      localePath,
      page,
      perPage,
      perPages,
      count,
      sales,
      loading,
      urlQueries,
      loadSales,
      setRouteQueryParams,
      onChangePage,
      onChangePerPage,
      navigateToSale,
      route,
      router
    }
  },
  watch: {
    urlQueries() {
      // Update our values and reload data.
      this.page = this.route.query.page
        ? parseInt(this.route.query.page as string)
        : 1
      this.perPage = this.route.query.per_page
        ? parseInt(this.route.query.per_page as string)
        : 10

      this.loadSales()
    }
  }
})
</script>
<style lang="scss">
.sales-table-sm {
  @apply block flex w-full md:hidden;

  &__header {
    @apply w-1/4  font-bold first-line:px-2;
  }

  &__content {
    @apply flex flex-col border-b md:hidden;
  }
  &__rows {
    @apply hover flex flex-row flex-wrap border-b py-3;
  }
  &__col {
    @apply flex w-1/2 flex-col justify-center align-middle text-sm first-letter:p-2;
  }
  &__action {
    @apply ml-auto w-full py-2;
  }
}
</style>
