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
    @apply relative text-sm pl-4 m-0;
    &:before {
      @apply absolute left-0 top-1  rounded-full block h-3 w-3 bg-base-500;
      content: '';

    }
    &.state--draft {

    }
    &.state--cancel {
      @apply before:bg-error;
    }
    &.state--sale {
      @apply before:bg-info;
    }
    &.state--pending {
      @apply before:bg-info;
    }
    &.state--processing {
      @apply before:bg-warning;
    }
    &.state--delivery_full {
      @apply before:bg-success;
    }
    &.state--delivery_partial {
      @apply before:bg-accent;
    }
    &.state--estimating {
      @apply before:bg-info;
    }
    &.state--estimated {
      @apply before:bg-info;
    }
  }
</style>
