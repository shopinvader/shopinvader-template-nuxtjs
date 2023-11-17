<template>
  <div v-if="service" class="payment-manual">
    <div class="payment-manual__icon">
      <slot name="icon">
        <icon icon="solar:card-transfer-bold-duotone" />
      </slot>
    </div>
    <div class="payment-manual__body">
      <div class="body__title">
        <slot name="title">
          {{ paymentMode?.name || $t('payment.manual.title') }}
        </slot>
      </div>
      <div class="body__message">
        <slot name="body">
          {{ paymentMode?.description || $t('payment.manual.intro') }}
        </slot>
      </div>
    </div>
    <div class="payment-manual__cta">
      <slot name="body">
        <button
          type="button"
          class="btn-primary btn"
          :disabled="loading"
          :class="{ loading: loading }"
          @click="submit"
        >
          {{ $t('payment.manual.cta') }}
        </button>
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
import { ErpFetch } from '@shopinvader/fetch'
import { PaymentMode } from '#models'
import { PaymentManualService } from '~/services'

export default defineNuxtComponent({
  name: 'PaymentGeneric',
  emits: ['success', 'error'],
  props: {
    paymentMode: {
      type: Object as PropType<PaymentMode>,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      service: null as PaymentManualService | null
    }
  },
  setup() {
    const erp = useShopinvaderProviders('erp') || null
    if (!erp) throw new Error('No erp provider found')
    let service = new PaymentManualService(erp as ErpFetch)
    return { service }
  },
  methods: {
    async submit() {
      try {
        this.loading = true
        this.$emit('submit', 'manual')
        await this.service.addPayment(this.paymentMode.id)
        this.$emit('success')
      } catch (e) {
        this.$emit('error', e)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
<style lang="scss">
.payment-manual {
  @apply flex items-center justify-between  gap-4 p-4;
  &__icon {
    @apply text-6xl;
  }
  &__body {
    @apply flex-grow;
    .body {
      @apply text-sm;
      &__title {
        @apply text-lg font-bold;
      }
    }
  }
}
</style>
