<template>
  <div v-if="sale.state" class="status" :class="`state--${sale.state}`" >
    {{ $t(`sale.status.${sale.state}`) }}
  </div>
</template>
<script lang="ts" setup>
import { Sale } from '#models'
const props = defineProps({
  sale: {
    type: Object as PropType<Sale>,
    required: true
  }
})
</script>
<style lang="scss">
  .status {
    &.state--draft {
      @apply badge badge-warning;
    }
    &.state--cancel {
      @apply badge badge-error;
    }
    &.state--sale {
      @apply badge badge-info;
    }
    &.state--processing {
      @apply badge badge-info;
    }
    &.state--delivery_full {
      @apply badge badge-secondary;
    }
    &.state--delivery_partial {
      @apply badge badge-success;
    }
    &.state--estimating {
      @apply badge badge-info;
    }
    &.state--estimated {
      @apply badge badge-success;
    }
  }
</style>
