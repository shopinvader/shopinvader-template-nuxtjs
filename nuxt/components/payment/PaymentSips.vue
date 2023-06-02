<template>
  <div v-if="service" class="payment-sips">
    <div class="payment-sips__icon">
      <slot name="icon">
        <icon icon="solar:card-2-bold-duotone" />
      </slot>
    </div>
    <div class="payment-sips__body">
      <div class="body__title">
        <slot name="title">
          {{ paymentMode?.name || $t('payment.sips.title') }}
        </slot>
      </div>
      <div class="body__message">
        <slot name="body">
          {{ paymentMode?.description || $t('payment.sips.intro') }}
          <div class="icons">
            <icon icon="logos:mastercard" />
            <icon icon="logos:visa" />
            <icon icon="logos:amex" />
            <icon icon="twemoji:credit-card" />
          </div>
        </slot>
      </div>
      <form
        class="body__cta"
        method="POST"
        :action="sipsPayment.actionUrl"
        @submit.prevent="submit"
      >
        <input type="hidden" id="data" name="Data" />
        <input type="hidden" id="seal" name="Seal" />
        <input type="hidden" id="interfaceVersion" name="InterfaceVersion" />
        <button type="submit" class="btn-secondary btn-sm btn">
          {{ $t('payment.sips.cta') }}
        </button>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { PaymentMode } from '~/models/PaymentModes'
import { SipsPayment } from '~/models'
import { PaymentSipsService } from '~/services'
import { ErpFetch } from '@shopinvader/fetch'

export default defineNuxtComponent({
  name: 'PaymentSips',
  emits: ['submit', 'error'],
  props: {
    paymentMode: {
      type: Object as PropType<PaymentMode>,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      opened: false,
      sipsPayment: new SipsPayment({}) as SipsPayment
    }
  },
  setup() {
    const { providers } = useShopinvader()
    if (!providers?.erp) throw new Error('No erp provider found')
    let service = new PaymentSipsService(providers?.erp as ErpFetch)
    return { service }
  },
  methods: {
    async prepare(): Promise<SipsPayment | null> {
      if (this.service) {
        const sipsPayment: SipsPayment = await this.service?.prepare(
          this.paymentMode.id,
          'current_cart'
        )
        if (sipsPayment?.data) {
          return sipsPayment
        }
      }
      return null
    },
    async submit(e: Event) {
      e.preventDefault()

      try {
        this.$emit('submit')
        const form = e.target as HTMLFormElement
        this.loading = true
        const sipsPayment: SipsPayment | null = await this.prepare()
        if (sipsPayment) {
          form.querySelector('#data')?.setAttribute('value', sipsPayment.data)
          form.querySelector('#seal')?.setAttribute('value', sipsPayment.seal)
          form
            .querySelector('#interfaceVersion')
            ?.setAttribute('value', sipsPayment.interfaceVersion)

          form.action = sipsPayment.actionUrl
          form?.submit()
        }
      } catch (e: any) {
        this.$emit('error', e)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
<style lang="scss">
.payment-sips {
  @apply flex items-start justify-start  gap-4 p-4;
  &__icon {
    @apply text-6xl text-secondary;
  }
  &__body {
    @apply flex flex-grow flex-col;
    .body {
      &__title {
        @apply col-span-2 text-lg font-bold;
      }
      &__message {
        @apply col-span-2 text-xs;
        .icons {
          @apply flex items-center justify-start gap-2 py-3 text-lg;
        }
      }
      &__cta {
        @apply flex w-auto flex-auto items-center justify-end;
      }
    }
  }
}
</style>
