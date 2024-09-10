<template>
  <div class="payment-transaction">
    <template v-if="error">
      <div class="alert">
        {{ $t('error.generic') }}
        <code>
          {{ error }}
        </code>
      </div>
    </template>
    <template v-else>
      <spinner></spinner>
      <div ref="formPayment" v-html="transaction.redirectFormHtml"></div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { PaymentTransaction } from '#models'
import { onMounted } from 'vue'
const formPayment = ref<HTMLFormElement | null>(null)
defineProps({
  transaction: {
    type: Object as PropType<PaymentTransaction>,
    required: true
  }
})
const error = ref(null)
const loading = ref(true)
onMounted(() => {
  try {
    loading.value = true
    if (formPayment.value) {
      const el = formPayment.value
      let form = el?.querySelector('form')
      if (!form && el.querySelector('input[data-action-url]')) {
        const element = el.querySelector('input[data-action-url]') as HTMLInputElement
        const url = element?.dataset?.actionUrl || ''
        form = document.createElement('form')
        form.method = 'POST'
        form.action = url
        form.innerHTML = el.innerHTML
        document.body.appendChild(form)
      }
      if (form?.submit) {
        form.submit()
      } else {
        throw new Error('Form not found')
      }
    }
  } catch (e: any) {
    error.value = e
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
<style lang="scss">
.payment-transaction {
  @apply flex h-40 items-center justify-center;
}
</style>
