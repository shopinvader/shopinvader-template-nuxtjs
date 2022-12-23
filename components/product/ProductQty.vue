<template>
  <div v-if="stock != null && stock.stock_qty > 0 ">
    <div>
      {{ $t("product.stock.available") }} : {{ $t("product.delivery.availability") }}
    </div>
  </div>
  <div v-else>
      <div class="mt-3">{{ $t('product.stock.unavailable') }}</div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { ProductQty } from '~~/models/ProductQty';

export default {
  name: 'ProductQty',
  props: {
    stock: {
      type: Object as PropType<ProductQty>,
      required: true,
    },
  }
};
</script>
