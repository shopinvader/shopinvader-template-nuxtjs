<template>
  <OrderInvoiceLine :line="line" :key="line">
    <template #qty>
      <div class="qty__label">
        {{ $t('cart.line.quantity') }} :
        <span class="font-bold text-gray-900">
          {{ line.qty }}
        </span>
      </div>
    </template>
    <template #price>
      <div class="value text-2xl font-bold text-success">
        <div
          v-if="line.amount.totalWithoutDiscount"
          class="price__original text-sm font-normal text-gray-500 line-through"
        >
          {{ $filter.currency(line.amount.totalWithoutDiscount) }}
        </div>
        <div class="price__value">
          {{ $filter.currency(line.amount.total) }}
        </div>
      </div>
    </template>
    <template #actions>
      <button class="btn-primary btn-xs btn">
        <icon icon="ph:arrow-right"></icon>
      </button>
    </template>
  </OrderInvoiceLine>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import { SaleLines } from '#models'
import OrderInvoiceLine from './OrderInvoiceLine.vue'

export default defineNuxtComponent({
  name: 'AccountOrderDetails',
  components: {
    OrderInvoiceLine: OrderInvoiceLine
  },
  props: {
    line: {
      type: Object as PropType<SaleLines>,
      required: true
    }
  }
})
</script>
