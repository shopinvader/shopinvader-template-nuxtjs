<template>
  <table v-if="Array.isArray(sales)" class="sale-order-list">
    <thead class="sale-order-list__head">
      <tr>
        <th >
          {{ $t('account.sales.table_labels.ordernum') }}
        </th>
        <th>
          {{ $t('account.sales.table_labels.orderdate') }}
        </th>
        <th >
          {{ $t('account.sales.table_labels.status') }}
        </th>
        <th>
          {{ $t('account.sales.table_labels.pricenet') }}
        </th>
        <th>
          {{ $t('account.sales.table_labels.action') }}
        </th>
      </tr>
    </thead>
    <tbody class="sale-order-list__body">
      <template v-if="sales.length === 0">
        <tr>
          <td colspan="5">
            <slot name="empty">
              {{ $t('account.emptylist') }}
            </slot>
          </td>
        </tr>
      </template>
      <template v-else>
        <tr
          v-for="sale in sales"
          :key="'' + sale.id"
          @click="navigateToSale(sale)"
          class="sale-order-list__line"
        >
          <td class="line__name">
            <slot name="sale-name" :sale="sale">
              <span class="line__label">
                {{ $t('account.sales.table_labels.ordernum') }}
              </span>
              <span class="line__value">
                {{ sale.name }}
              </span>
            </slot>
          </td>
          <td class="line__date">
            <slot name="sale-date" :sale="sale" v-if="sale?.date">
              <span class="line__label">
                {{ $t('account.sales.table_labels.orderdate') }}
              </span>
              <span class="line__value">
                {{ sale?.date?.toLocaleDateString?.($i18n.locale) || '-' }}
              </span>
            </slot>
          </td>
          <td class="line__status">
            <slot name="sale-status" :sale="sale">
              <span class="line__label">
                {{ $t('account.sales.table_labels.status') }}
              </span>
              <span class="line__value">
                <sale-status :sale="sale"></sale-status>
              </span>

            </slot>
          </td>
          <td class="line__total">
            <slot v-if="sale.amount" name="sale-pricenet" :sale="sale">
              <span class="line__label">
                {{ $t('account.sales.table_labels.pricenet') }}
              </span>
              <span class="line__value">
                {{ $filter.currency(sale.amount.total) }}
              </span>
            </slot>
          </td>
          <td class="line__actions">
            <slot name="sale-actions" :sale="sale">
              <button type="button" class="actions__view">
                <icon name="right" />
              </button>
            </slot>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
  import type { Sale } from '#models';

  const props = defineProps({
    sales: {
      type: Array as PropType<Sale[]>,
      required: true
    }
  })

  const navigateToSale = (order: Sale) => {
    navigateTo({ path: `/account/sales/${order?.id}` })
  }
</script>
<style lang="scss">
.sale-order-list {
  @apply w-full flex md:table;
  &__head {
    @apply hidden md:table-header-group;
    th {
      @apply p-2 text-left;
    }
  }
  &__body {
    @apply flex flex-col w-full md:table-row-group;
  }
  &__line {
    @apply grid grid-cols-2 w-full max-md:border-b md:table-row hover:bg-base-50 cursor-pointer;
    .line {
      &__name {
        @apply  max-md:flex flex-col p-2 text-left md:text-sm;
        .line__value {
          @apply font-bold;
        }
      }
      &__date {
        @apply  max-md:flex flex-col p-2 text-left text-sm;
      }
      &__total {
        @apply  max-md:flex flex-col p-2 text-left text-sm;
      }
      &__status {
        @apply  max-md:flex flex-col p-2 text-left text-sm;
      }
      &__actions {
        @apply p-2 text-right text-sm col-span-2;
        .actions__view {
          @apply btn btn-primary btn-sm md:btn-ghost;
        }
      }
      &__label {
        @apply md:hidden text-xs;
      }
    }
  }
}
</style>
