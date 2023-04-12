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
        <div class="mr-auto">
          <h3 class="text-gray-600">Date</h3>
          <p class="font-bold text-primary">
            {{ sale.date.toLocaleDateString($i18n.locale) }}
          </p>
        </div>
        <a
          class="btn-primary btn-sm btn mt-8 md:mt-0"
          @click="download(sale.id)"
        >
          <icon icon="material-symbols:print" class="text-2xl"></icon>
          <span class="ml-2">{{ $t('btn.download') }}</span>
        </a>
      </div>
      <div class="content__progress">
        <div clas="text-gray">
          {{ $t('account.sales.sale_state') }}
          <span class="badge-primary badge ml-2 text-xs uppercase">
            {{ sale.stateLabel }}
          </span>
        </div>
        <progress
          class="progress progress-primary"
          value="25"
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
            <div class="line">
              <span class="text">{{ $t('account.sales.sale_subtotal') }}</span>
              <span class="amount">{{
                $filter.currency(sale.amount.untaxed)
              }}</span>
            </div>
          </div>
          <div class="footer__shipping">
            <div class="line">
              <span class="text">{{ $t('account.sales.sale_shipping') }}</span>
              <span class="amount">{{
                $filter.currency(sale.shipping.amount.untaxed)
              }}</span>
            </div>
          </div>
          <div class="footer__tax">
            <div class="line">
              <span class="text">{{ $t('account.sales.sale_tax') }}</span>
              <span class="amount">{{
                $filter.currency(sale.amount.tax)
              }}</span>
            </div>
          </div>
          <div class="footer__total">
            <div class="line">
              <span class="total__text">{{ $t('account.sales.sale_total') }}</span>
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
      <template v-if="working"> ... </template>
      <div class="overflow-x-auto">
        <div class="sales-table-sm__content"></div>
      </div>
    </template>
  </account-layout>
</template>

<script lang="ts">
import AccountLayout from '~/components/account/AccountLayout.vue'
import { Sale } from '~/models/Sale'
import { ref } from 'vue'

export default defineNuxtComponent({
  name: 'PageAccountSaleDetail',
  components: {
    'account-layout': AccountLayout
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const sale = ref(null as { Sale })
    const working = ref(false)

    async function loadSale() {
      const id = route.params._id
      const services = useShopinvaderServices()
      working.value = true
      try {
        const res = await services?.sales?.getSale(id)
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
        working.value = false
      }
    }

    async function download(sale:Sale) {
      const services = useShopinvaderServices()
      working.value = false
      try {
        const blob = await services?.sales?.downloadSale(sale.id)
        const fatUrl = window.URL.createObjectURL(blob)
        // Create a temporary link.
        const a: any = document.createElement('a')
        a.href = fatUrl
        a.style = 'display: none'
        a.download = 'order_' + sale.value.name + '.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(fatUrl)
        document.body.removeChild(a)
      } catch (error: any) {
        console.log(error)
      } finally {
        working.value = false
      }
    }

    onMounted(() => {
      loadSale()
    })

    return {
      sale,
      working,
      loadSale,
      route,
      router,
      download
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
        .line {
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
        @apply rounded-full bg-gray-100 py-3 px-10;
      }
      &__shipping,
      &__total {
        @apply rounded-full py-3 px-10;
      }
      &__total {
        .line {
          .total__text {
            @apply text-base font-bold md:text-xl;
          }
          .total__amount {
            @apply font-bold;
          }
        }
      }
      &__addresses {
        @apply mb-10 bg-gray-100 py-10 px-4;
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
