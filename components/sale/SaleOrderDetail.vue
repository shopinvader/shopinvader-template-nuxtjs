<template>
  <sale-detail v-if="sale?.id" v-show="!loading" :sale="sale" class="sale">
    <template #action>
      <button
        type="button"
        class="btn btn-primary btn-sm mt-8 md:mt-0"
        @click="download('sale', sale.id)"
      >
        <icon name="printer" class="text-2xl"></icon>
        <span class="ml-2">{{ t('btn.download') }}</span>
      </button>
    </template>
  </sale-detail>
  <div v-if="loading" class="sale__loading">
    <spinner />
  </div>
</template>
<script setup lang="ts">
import type { Sale } from '#models'
const loading = ref(false)
const error = ref('')
const { t } = useI18n()
const props = defineProps({
  sale: {
    type: Object as PropType<Sale>,
    required: true
  }
})
const download = async (action: string, id: number) => {
  loading.value = true
  const saleService = useShopinvaderService('sales')
  let docName
  let downloadService
  if (action == 'sale') {
    downloadService = await saleService?.download(id)
    docName = 'order_' + props.sale.name + '.pdf'
  } else {
    downloadService = await saleService?.downloadInvoice(id)
    docName = 'invoice_' + id + '.pdf'
  }

  try {
    const blob = (await downloadService) || null
    if (!blob) return
    const fatUrl = window.URL.createObjectURL(blob)
    // Create a temporary link.
    const a: any = document.createElement('a')
    a.href = fatUrl
    a.style = 'display: none'
    a.download = docName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(fatUrl)
    document.body.removeChild(a)
  } catch (err: any) {
    console.log(err)
    error.value = err
  } finally {
    loading.value = false
  }
}
</script>
<style>
@reference "@/assets/css/main.css";

.sale {
  &__loading {
    @apply flex h-96 items-center justify-center;
  }
}
</style>
