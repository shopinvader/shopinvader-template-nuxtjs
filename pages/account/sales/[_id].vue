<template>
  <div></div>
  <account-layout slug="sales">
    <template #title>
      <div class="tite__container flex items-center py-3">
        <div class="flex flex-grow items-center">
          <h1 class="text-3xl">
            {{ $t('account.sales.title') }}
          </h1>
        </div>
      </div>
    </template>
    <template v-if="sale" #content>
      <div class="content__info">
        <div class="mr-20">
          <h3 class="text-gray-600">{{ $t('account.sales.sale') }} N°</h3>
          <p class="font-bold text-primary">{{ sale.name }}</p>
        </div>
        <div class="mr-20">
          <h3 class="text-gray-600">Date</h3>
          <p class="font-bold text-primary">
            {{ sale.date.toLocaleDateString($i18n.locale) }}
          </p>
        </div>
        <div class="mr-auto">
          <h3 v-if="sale.invoices.length > 0" class="text-gray-600">
            {{ $t('account.sales.sale_invoice_number') }}
          </h3>
          <div
            v-for="invoice in sale.invoices"
            :key="invoice.id"
            class="font-bold text-primary"
          >
            <div
              v-if="invoice"
              class="cursor-pointer"
              @click="download('invoice', invoice.id)"
            >
              {{ invoice.name }}
              <icon
                icon="material-symbols:download-for-offline-outline"
                class="inline text-2xl"
              ></icon>
            </div>
          </div>
        </div>
        <a
          class="btn-primary btn-sm btn mt-8 md:mt-0"
          @click="download('sale', sale.id)"
        >
          <icon icon="material-symbols:print" class="text-2xl"></icon>
          <span class="ml-2">{{ $t('btn.download') }}</span>
        </a>
      </div>
      <div v-if="sale.state" class="content__progress">
        <div clas="text-gray">
          {{ $t('account.sales.sale_state') }}
          <order-status-badge :sale="sale" ></order-status-badge>
        </div>
        <progress
          :class="`progress progress-${saleStatusColor}`"
          :value="sale.state == 'shipped' ? '100' : '25' "
          max="100"
        ></progress>
      </div>
      <AccountOrderLine
        v-for="line in sale.lines.items"
        :line="line"
        v-bind:key="line.id"
      ></AccountOrderLine>
      <div class="content__footer">
        <div class="mb-10">
          <div class="footer__subtotal">
            <div class="line-amount">
              <span class="text">{{ $t('account.sales.sale_subtotal') }}</span>
              <span class="amount">{{
                $filter.currency(sale.amount.untaxed)
              }}</span>
            </div>
          </div>
          <div class="footer__shipping">
            <div class="line-amount">
              <span class="text">{{ $t('account.sales.sale_shipping') }}</span>
              <span class="amount">{{
                $filter.currency(sale.shipping.amount.untaxed)
              }}</span>
            </div>
          </div>
          <div class="footer__tax">
            <div class="line-amount">
              <span class="text">{{ $t('account.sales.sale_tax') }}</span>
              <span class="amount">{{
                $filter.currency(sale.amount.tax)
              }}</span>
            </div>
          </div>
          <div class="footer__total">
            <div class="line-amount">
              <span class="total__text">{{
                $t('account.sales.sale_total')
              }}</span>
              <span class="total__amount">{{
                $filter.currency(sale.amount.total)
              }}</span>
            </div>
          </div>
        </div>
        <div class="footer__addresses">
          <div class="addresses__container">
            <div class="shipping">
              <h4 class="address-title">
                {{ $t('account.address.type.delivery') }}
              </h4>
              <p class="address-text">{{ sale.shipping.address.street }}</p>
              <p class="address-text">
                {{ sale.shipping.address.zip }} {{ sale.shipping.address.city }}
              </p>
              <p class="address-text">
                {{ sale.shipping.address.country.name }}
              </p>
            </div>
            <div class="invoice">
              <h4 class="address-title">
                {{ $t('account.address.type.invoice') }}
              </h4>
              <p class="address-text">{{ sale.invoicing.address.street }}</p>
              <p class="address-text">
                {{ sale.invoicing.address.zip }}
                {{ sale.invoicing.address.city }}
              </p>
              <p class="address-text">
                {{ sale.invoicing.address.country.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <template v-if="loading"> ... </template>
      <div class="overflow-x-auto">
        <div class="sales-table-sm__content"></div>
      </div>
    </template>
  </account-layout>
</template>

<script lang="ts">
import AccountLayout from '~/components/account/AccountLayout.vue'
import OrderStatusBadge from '~/components/account/OrderStatusBadge.vue'
import { Sale } from '~/models/Sale'
import { ref } from 'vue'

export default defineNuxtComponent({
  name: 'PageAccountSaleDetail',
  components: {
    'account-layout': AccountLayout,
    'order-status-badge': OrderStatusBadge
  },
  setup() {
    definePageMeta({
      auth: true
    })
    const router = useRouter()
    const route = useRoute()
    const loading = ref(false)
    const sale = ref<Sale | null>()
    async function loadSale() {
      const id = parseInt(route.params._id)
      const salesService = useShopinvaderService('sales')
      loading.value = true
      try {
        const res = (await salesService?.getSale(id)) || null
        sale.value = res
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
    const saleStatusColor = computed(() => {
      let statusColor =''
        if(sale?.value?.state == 'cancel') {
          statusColor = 'error'
        } else if (sale?.value?.state == 'processing') {
          statusColor = 'secondary'
        } else if (sale?.value?.state == 'invoiceable') {
          statusColor = 'success'
        }
      return statusColor
      
    })

    async function download(action: string, id: number) {
      const saleService = useShopinvaderService('sales')
      let docName
      let downloadService
      if (action == 'sale') {
        downloadService = await saleService?.downloadSale(id)
        docName = 'order_' + sale.value.name + '.pdf'
      } else {
        downloadService = await saleService?.downloadSaleInvoice(id)
        docName = 'invoice_' + id + '.pdf'
      }
      loading.value = false
      try {
        const blob = await downloadService
        const fatUrl = window.URL.createObjectURL(blob)
        // Create a temporary link.
        const a: any = document.createElement('a')
        a.href = fatUrl
        a.style = 'display: none'
        a.download = docName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(fatUrl)
        document.body.removeChild(a)
      } catch (error: any) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadSale()
    })

    return {
      sale,
      loading,
      loadSale,
      route,
      router,
      download,
      saleStatusColor
    }
  }
})
</script>

<style lang="scss">
.content {
  &__info {
    @apply mb-12 flex flex-col flex-wrap md:flex-row;
  }
  &__progress {
    @apply w-full py-2 pb-8;
  }
  &__footer {
    .footer {
      &__subtotal,
      &__shipping,
      &__tax,
      &__total {
        .line-amount {
          @apply flex justify-between;
          .text {
            @apply font-medium;
          }
          .amount {
            @apply font-bold;
          }
        }
      }
      &__subtotal,
      &__tax {
        @apply rounded-full bg-gray-100 px-10 py-3;
      }
      &__shipping,
      &__total {
        @apply rounded-full px-10 py-3;
      }
      &__total {
        .line-amount {
          .total__text {
            @apply text-base font-bold md:text-xl;
          }
          .total__amount {
            @apply font-bold;
          }
        }
      }
      &__addresses {
        @apply mb-10 bg-gray-100 px-4 py-10;
        .addresses__container {
          @apply -mx-4 flex flex-wrap justify-around;
          .shipping,
          .invoice {
            @apply mb-6 w-full px-4 md:mb-0 md:w-auto;
            .address-title {
              @apply mb-6 font-bold;
            }
            .address-text {
              @apply text-gray-500;
            }
          }
        }
      }
    }
  }
}
</style>
