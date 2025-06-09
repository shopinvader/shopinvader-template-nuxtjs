<template>
  <div v-if="sale.delivery.pickings?.length" class="sale-pickings">
    <button type="button" class="sale-pickings__link" @click="isOpen = !isOpen">
      <icon name="carrier" class="" />
      {{ t('sale.delivery.pickings.link') }}
    </button>
    <aside-drawer
      :open="isOpen"
      @close="isOpen = false"
      class-content="sale-pickings__aside"
      direction="right"
    >
      <template #header>
        <div class="aside__header">
          {{ t('sale.delivery.pickings.title') }}
        </div>
      </template>
      <template #content>
        <div class="sale-pickings">
          <picking-list :pickings="sale.delivery.pickings" />
        </div>
      </template>
    </aside-drawer>
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
const isOpen = ref(false)
const { t } = useI18n()
</script>
<style>
@reference "@/assets/css/main.css";

.sale-pickings {
  @apply inline-block;
  &__link {
    @apply flex items-center gap-1 text-sm underline;
    .icon {
      @apply h-4 w-4 text-primary;
    }
  }
  &__aside {
    .aside__header {
      @apply flex items-center gap-1 text-xl font-bold;
    }
    .sale-pickings {
      @apply w-full;
    }
  }
}
</style>
