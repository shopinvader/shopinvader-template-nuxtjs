<template>
  <div class="sale-last-lines">
    <div v-if="error" class="sale-last-lines__error">
      {{ error }}
    </div>
    <div v-if="loading"  class="sale-last-lines__loading">
      <spinner />
    </div>
    <div v-else class="sale-last-lines__content">
      <sale-line v-for="line in lines" :key="line.id" :line="line">
      </sale-line>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { SaleLine } from '#models';

  const saleService = useShopinvaderService('sales')
  const lines = ref([]) as Ref<SaleLine[]>
  const error = ref(null) as Ref<Error | null>
  const loading = ref(false)
  const page = ref(1)
  const count = ref(0)
  const perPage = ref(5)
  const search = async () => {
    if(saleService) {
      try {
        loading.value = true
        const res = await saleService.getSaleLines(page.value, perPage.value)
        lines.value = res?.items || []
        count.value = res?.count || 0
      } catch (e: any) {
        console.error(e)
        error.value = e
      } finally {
        loading.value = false
      }
    }
  }
  onMounted(async () => {
    await search()
  })
</script>
<style lang="scss">
.sale-last-lines {
  &__error {
    @apply alert alert-error;
  }
  &__content {
    @apply flex flex-col gap-2 mt-4;
    .line {
      @apply card card-bordered card-side card-compact ;
    }
  }
  &__loading {
    @apply flex justify-center items-center h-40;
  }
}
</style>
