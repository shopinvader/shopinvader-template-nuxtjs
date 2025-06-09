<template>
  <div v-if="sale.state" class="status" :class="`state--${sale.state}`">
    {{ $t(`sale.status.${sale.state}`) }}
  </div>
</template>
<script lang="ts" setup>
import type { Sale } from '#models'
defineProps({
  sale: {
    type: Object as PropType<Sale>,
    required: true
  }
})
</script>
<style>
@reference "@/assets/css/main.css";

.status {
  @apply relative m-0 pl-4 text-sm;
  &:before {
    @apply absolute left-0 top-1 block h-3 w-3 rounded-full bg-base-500;
    content: '';
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
    @apply before:bg-success;
  }
}
</style>
