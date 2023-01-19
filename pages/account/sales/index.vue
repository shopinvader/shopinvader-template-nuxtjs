<template>
  <AccountLayout slug="sales">
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
    <template #content>
      <template v-if="working"> ... </template>
      <div class="overflow-x-auto">
        <table v-if="sales" class="table-zebra table w-full">
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
              <tr v-for="sale in sales" :key="'' + sale.id" class="hover">
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
                  <span class="badge badge-md px-3 text-xs">{{
                    sale.stateLabel
                  }}</span>
                </td>
                <td class="p-2 text-right text-sm">
                  <div class="md:whitespace-nowrap">
                    <button
                      class="btn-small btn-link btn"
                      @click="showDetails(sale)"
                    >
                      <label>{{ $t('btn.view_more') }}</label>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
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
        <PaginationStatus
          :per-page="perPage"
          :page="page"
          :total-items="count"
          class="mx-auto"
        ></PaginationStatus>
        <Pagination
          :total="count"
          :size="perPage"
          :page="page"
          class="mx-auto"
          @change="onChangePage($event)"
        ></Pagination>
      </div>
    </template>
  </AccountLayout>
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
    AccountLayout,
    Pagination,
    PaginationStatus
  },
  setup(props) {
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
    const sales = ref(null as Sale[])
    const working = ref(false)

    const urlQueries = computed(() => {
      return (route.query.page +
        '|' +
        route.query.per_page +
        '|' +
        route.query.filter) as string
    })

    async function loadSales() {
      console.log('loading')
      const services = useShopinvaderServices()
      working.value = true
      try {
        const res = await services?.sales?.getSalesList(
          page.value,
          perPage.value
        )
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
        working.value = false
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

    function showDetails(sale: Sale) {
      alert('not ready yet')
      // const router = useRouter()
      // router.push(localePath('/account/sales/' + sale.id))
    }

    onMounted(() => {
      loadSales()
    })

    return {
      page,
      perPage,
      perPages,
      count,
      sales,
      working,
      urlQueries,
      loadSales,
      setRouteQueryParams,
      onChangePage,
      onChangePerPage,
      showDetails,
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