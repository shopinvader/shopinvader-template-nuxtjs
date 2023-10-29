<template>
  <div class="sale-list">

  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { Sale } from '#models'
export default {
  props: {
    sales: {
      required: true,
      type: Array as PropType<Sale[]>
    }
  },
}
</script>
