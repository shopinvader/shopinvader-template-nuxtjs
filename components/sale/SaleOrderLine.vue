<template>
  <SaleLine :line="line" :key="line.id">
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
      <button class="btn btn-primary btn-xs">
        <icon name="right"></icon>
      </button>
    </template>
  </SaleLine>
</template>

<script lang="ts">
import type { SaleLine } from '#models'
import type { PropType } from 'vue'

export default defineNuxtComponent({
  name: 'AccountOrderDetails',

  props: {
    line: {
      type: Object as PropType<SaleLine>,
      required: true
    }
  }
})
</script>
