<template>
  <div class="picking-item">
    <div v-if="picking.carrier" class="picking-item__carrier">
      <slot name="carrier" :picking="picking">
        <div class="carrier__name">
          <icon name="carrier" class="icon" />
          {{ picking.carrier.name }}
        </div>
        <div class="carrier__state">
          <div class="value">{{ t(`picking.status.${picking.state}`) }}</div>
        </div>
        <div class="carrier__description">
          {{ picking.carrier.description }}
        </div>
      </slot>
    </div>
    <div class="picking-item__content">
      <slot name="ref" :picking="picking">
        <div class="content__date">
          {{ t('picking.deliveryDate') }}
          <div class="value">{{ picking.deliveryDate?.toLocaleDateString(locale) }}</div>
        </div>
        <div v-if="picking.trackingReference" class="content__tracking">
          {{ t('picking.tracking') }}
          <div class="value">{{ picking.trackingReference }}</div>
        </div>
      </slot>
    </div>
    <div v-if="picking?.lines && picking?.lines?.length > 0" class="picking-item__lines">
      <slot name="lines" :picking="picking">
        <table class="table">
          <thead>
            <tr>
              <th>{{ t('picking.product') }}</th>
              <th></th>
              <th>{{ t('picking.quantity') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(line, index) in picking?.lines" :key="line.id || index">
              <td class="line__name">
                {{ line?.product?.name || line?.productName }}
              </td>
              <td class="line__name">
                {{ t(`picking.status.${line.state}`) }}
              </td>
              <td class="line__qty">{{ line?.quantity }}</td>
            </tr>
          </tbody>
        </table>
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
.picking-item {
  @apply card card-body card-bordered p-4;
  &__carrier {
    @apply flex items-center gap-2;
    .carrier__name {
      @apply flex items-center gap-1 text-lg font-bold;
      .icon {
        @apply h-5 w-5 text-primary;
      }
    }
    .carrier__state {
      @apply badge badge-primary badge-outline;
      .value {
        @apply text-xs;
      }
    }
    .carrier__description {
      @apply flex-1 text-sm;
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
  &__lines {
    .line {
      &__name {
      }
      &__qty {
      }
    }
  }
}
</style>
