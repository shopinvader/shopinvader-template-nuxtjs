<template>
  <div class="picking-list">
    <div class="picking-list__content">
      <template v-for="picking in pickings" :key="picking.id">
        <slot name="picking" :picking="picking">
          <picking-line :picking="picking" :key="picking.id" />
        </slot>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Picking } from '#models'
defineProps({
  pickings: {
    type: Array as PropType<Picking[]>,
    required: true
  }
})
</script>
<style lang="scss">
.picking-list {
  &__content {
    @apply flex w-full flex-col gap-3;
  }
}
</style>
