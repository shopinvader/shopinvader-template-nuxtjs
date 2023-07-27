<template>
  <span :class="`badge badge-${color}`" class="ml-2 text-xs uppercase" >
  {{$t(`account.sales.state.${sale?.state}`)}}
  </span>
</template>
<script lang="ts">
import { Sale, SaleItem } from "models/Sale";



export default defineNuxtComponent({
  name: 'PageAccountSaleDetail',
  props: {
    sale: {
      required: false,
      type: Object as PropType<Sale>
    },
  },
  computed: {
    color() {
      let statusColor =''
        if(this.sale?.state == 'cancel') {
          statusColor = 'error'
        } else if (this.sale?.state == 'processing') {
          statusColor = 'secondary'
        } else if (this.sale?.state == 'shipped') {
          statusColor = 'success'
        }
      return statusColor
    }
  }
})
</script>

