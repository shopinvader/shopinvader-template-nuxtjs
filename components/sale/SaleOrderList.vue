<template>
  <data-table
    class-table="sale-order-list"
    :columns="columns"
    :search="searchSaleOrder"
    @click="navigateToSale"
  >
    <template #date-data="{ row }">
      {{ row?.date?.toLocaleDateString?.($i18n.locale) || '-' }}
    </template>
    <template #status-data="{ row }">
      <sale-status :sale="row"></sale-status>
    </template>
    <template #amount-data="{ row }">
      {{ formatCurrency(row.amount.total) }}
    </template>
    <template #action-data="{ row }">
      <button type="button" class="actions__view" @click="navigateToSale(row)">
        <icon name="right" />
      </button>
    </template>
  </data-table>
</template>
<script lang="ts" setup>
import type { Sale } from '#models'
import { formatCurrency } from '../../helpers/StringHelper'

const { t } = useI18n()
const saleService = useShopinvaderService('sales')
const searchSaleOrder = async (page: number, size: number) => {
  const res = await saleService?.getAll(page, size)
  return {
    count: res?.count || 0,
    rows: res?.items || []
  }
}
const columns = [
  {
    key: 'name',
    label: t('account.sales.table_labels.ordernum'),
    class: 'sale__name'
  },
  {
    key: 'date',
    label: t('account.sales.table_labels.orderdate')
  },
  {
    key: 'status',
    label: t('account.sales.table_labels.status')
  },
  {
    key: 'amount',
    label: t('account.sales.table_labels.pricenet')
  },
  {
    key: 'action',
    label: '',
    class: 'sale__action'
  }
]
const navigateToSale = async (order: Sale) => {
  const localePath = useLocalePath()
  await navigateTo(localePath({ path: `/account/sales/${order?.id}` }))
}
</script>
<style lang="scss">
.sale-order-list {
  .sale {
    &__name {
      .cell__value {
        @apply cursor-pointer font-bold;
      }
    }
    &__action {
      @apply col-span-2 text-right;
      .actions__view {
        @apply btn btn-primary btn-sm md:btn-ghost;
      }
    }
  }
}
</style>
