<template>
  <AccountLayout slug="sales">
    <template #title>
      {{ $t("account.sales.title") }}
    </template>
    <template #content>
      <template v-if="working"> ... </template>
      <div class="overflow-x-auto">
        <table v-if="sales" class="table table-zebra w-full">
          <thead>
            <tr>
              <th class="text-left">
                {{ $t("account.sales.table_labels.ordernum") }}
              </th>
              <th class="text-left">
                {{ $t("account.sales.table_labels.orderdate") }}
              </th>
              <th class="text-left">
                {{ $t("account.sales.table_labels.pricenet") }}
              </th>
              <th class="text-left">
                {{ $t("account.sales.table_labels.status") }}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="sales.length === 0">
              <tr>
                <td colspan="100%">
                  {{ $t("account.emptylist") }}
                </td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="sale in sales" :key="'' + sale.id">
                <td style="vertical-align: middle" class="text-left">
                  {{ sale.name }}
                </td>
                <td style="vertical-align: middle" class="text-left">
                  <template v-if="sale.date">
                    {{ sale.date.toLocaleDateString($i18n.locale) }}
                  </template>
                </td>
                <td style="vertical-align: middle" class="text-left">
                  <span v-if="sale.amountTotal">{{
                    $filter.currency(sale.amountTotal)
                  }}</span>
                </td>
                <td style="vertical-align: middle" class="text-left">
                  <span class="badge badge-md">{{ sale.stateLabel }}</span>
                </td>
                <td class="text-right">
                  <div class="md:whitespace-nowrap">
                    <button
                      class="btn btn-link btn-small"
                      @click="showDetails(sale)"
                    >
                      <label>{{ $t("btn.view_more") }}</label>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div v-if="count > 0" class="w-full mx-auto salesPage-pagination">
        <PaginationStatus
          :per-page="perPage"
          :page="page"
          :total-items="count"
          class="salesPage-paginationStatus"
        ></PaginationStatus>
        <div class="salesPage-paginationPerPage">
          {{ $t("pagination.showperpage") }}
          <select v-model="perPage" @change="onChangePerPage">
            <option
              v-for="numPerPage in perPages"
              :key="numPerPage"
              :value="numPerPage"
            >
              {{ numPerPage }}
            </option>
          </select>
        </div>
        <Pagination
          :total-items="count"
          :per-page="perPage"
          :page="page"
          @change="onChangePage($event)"
        ></Pagination>
      </div>
    </template>
  </AccountLayout>
</template>

<script lang="ts">
import AccountLayout from "~/components/account/AccountLayout.vue";
import Pagination from "~/components/Pagination.vue";
import PaginationStatus from "~/components/PaginationStatus.vue";
import { SalePartial } from "~/models/SalePartial";
import { ref } from "vue";

export default defineNuxtComponent({
  name: "PageAccountSales",
  components: {
    AccountLayout,
    Pagination,
    PaginationStatus
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const perPages = ref([10, 20, 50]);
    const localePath = useLocalePath();

    const perPage = ref(
      route.query.per_page ? parseInt(route.query.per_page as string) : 10
    );
    const page = ref(
      route.query.page ? parseInt(route.query.page as string) : 1
    );
    const count = ref(0);
    const sales = ref(null as SalePartial[]);
    const working = ref(false);

    const urlQueries = computed(() => {
      return (route.query.page +
        "|" +
        route.query.per_page +
        "|" +
        route.query.filter) as string;
    });

    async function loadSales() {
      console.log("loading");
      const services = useShopinvaderServices();
      working.value = true;
      try {
        const res = await services?.sales.erpGetSalesPartial(
          page.value,
          perPage.value
        );
        console.log("res", res);
        count.value = res.count;
        sales.value = res.sales;
      } catch (error: any) {
        if (
          error.name === "HttpErrorResponse" &&
          error.response.status === 401
        ) {
          console.log("login error message");
        } else {
          console.log("generic error message");
        }
      } finally {
        working.value = false;
      }
    }

    function setRouteQueryParams() {
      router.push({
        path: localePath("/account/sales"),
        query: {
          page: "" + page,
          per_page: "" + perPage,
        },
      });
    }

    function onChangePage(page: any) {
      page.value = page;
      setRouteQueryParams();
    }

    function onChangePerPage() {
      page.value = 1;
      setRouteQueryParams();
    }

    function showDetails(sale: SalePartial) {
      const router = useRouter();
      router.push(localePath("/account/sales/" + sale.id));
    }

    onMounted(() => {
      loadSales();
    });

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
      router,
    };
  },
  watch: {
    urlQueries() {
      // Update our values and reload data.
      this.page = this.route.query.page
        ? parseInt(this.route.query.page as string)
        : 1;
      this.perPage = this.route.query.per_page
        ? parseInt(this.route.query.per_page as string)
        : 10;

      this.loadSales();
    },
  },
});
</script>
