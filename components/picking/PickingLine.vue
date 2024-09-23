<template>
  <div class="picking-line">
    <div v-if="picking.carrier" class="picking-line__carrier">
      <slot name="carrier" :picking="picking">
        <div class="carrier__name">
          <icon name="carrier" class="icon" />
          {{ picking.carrier.name }}
        </div>

        <div class="carrier__description">
          {{ picking.carrier.description }}
        </div>
      </slot>
    </div>
    <div class="picking-line__content">
      <slot name="ref" :picking="picking">
        <div class="content__date">
          {{ t('picking.deiveryDate') }}
          <div class="value">{{ picking.deliveryDate?.toLocaleDateString(locale) }}</div>
        </div>
        <div v-if="picking.trackingReference" class="content__tracking">
          {{ t('picking.tracking') }}
          <div class="value">{{ picking.trackingReference }}</div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Picking } from '#models'
defineProps({
  picking: {
    type: Object as PropType<Picking>,
    required: true
  }
})
const { t, locale } = useI18n()
</script>
<style lang="scss">
.picking-line {
  @apply card card-body card-bordered p-4;
  &__carrier {
    @apply flex flex-col;
    .carrier__name {
      @apply flex items-center gap-1 text-lg font-bold;
      .icon {
        @apply h-5 w-5 text-primary;
      }
    }
  }
  &__content {
    @apply pl-5 text-sm;
    .content__date {
      @apply flex gap-1 pb-1;
      .value {
        @apply font-bold;
      }
    }
    .content__tracking {
      @apply flex gap-1;
      .value {
        @apply font-bold;
      }
    }
  }
}
</style>
