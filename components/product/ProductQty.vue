<template>
  <div v-if="stock != null">
    <div v-if="stock.stock_qty > 0 ">
      {{ $t("product.stock.available") }} : {{ $t("product.delivery.availability") }}
    </div>
    <div v-else>
        <div class="mt-3">Out of stock</div>
    </div>
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
<style lang="scss"></style>
