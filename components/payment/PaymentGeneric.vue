<template>
  <form class="payment-generic" ref="formPayment" @submit.prevent="select">
    <div class="payment-generic__name">
      <slot name="name" :method="method">
        {{ method.name }}
        <div v-if="method.state == 'test'" class="badge badge-accent">
          {{ method.state }}
        </div>
      </slot>
    </div>
    <div class="payment-generic__desc">
      <slot name="desc" :method="method">
        {{ method.payableReference }}
      </slot>
    </div>
    <div v-if="error" class="payment-generic__error">{{ error }}</div>
    <div class="payment-generic__form">
      <slot name="form" :method="method">
        <div v-if="method.expressCheckoutFormViewRendered" v-html="method.expressCheckoutFormViewRendered"></div>
        <div v-if="method.inlineFormViewRendered" v-html="method.inlineFormViewRendered"></div>
      </slot>
    </div>
    <div v-if="transaction" class="payment-generic__transaction">
      <slot name="transaction" :transaction="transaction">
      </slot>
    </div>
    <div class="payment-generic__icons">
      <img
        v-for="icon in method.icons"
        :src="`data:image/png;base64,${decodeImage(icon.image)}`"
        :alt="icon.name"
        class="icons__img"
      />
    </div>
    <div class="payment-generic__action">
      <button type="submit" class="action__submit" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner"></span>
        {{ $t('payment.select', {amount: paymentData.amountFormatted}) }}
        <icon name="right" />
      </button>
    </div>
  </form>
</template>
<script setup lang="ts">
  import { PaymentMethod, PaymentData, PaymentTransaction } from '#models'
  const emit = defineEmits(['select', 'transaction'])
  const inputs:any[] = []
  const loading = ref(false)
  const paymentService = useShopinvaderService('payment')
  const formPayment  = ref<HTMLFormElement | null>(null)
  const transaction = ref(null) as Ref<PaymentTransaction | null>
  const error = ref(null)
  const props = defineProps({
    method: {
      type: Object as PropType<PaymentMethod>,
      required: true
    },
    paymentData: {
      type: Object as PropType<PaymentData>,
      required: true
    }
  })
  const req = useRequestURL()
  const localePath = useLocalePath()
  const url = `${req.origin}${localePath({ path:`/checkout/validated`})}`

  const select = async (e:Event) => {
    try {
      loading.value = true
      if(formPayment.value) {
        const formData = new FormData(formPayment.value)
        for (const [key, value] of formData.entries()) {
          inputs.push({ key, value })
        }
      }
      if(!paymentService) {
        throw new Error('Payment service not available')
      }
      emit('select', inputs)
      error.value = null
      transaction.value = await paymentService.createTransaction(
        props.paymentData,
        props.method,
        inputs,
        url
      )

      if(transaction.value.redirectFormHtml) {
        const formDiv = document.createElement('div')
        formDiv.innerHTML = transaction.value.redirectFormHtml
        var form = formDiv.querySelector('form')
        document.body.appendChild(formDiv)
        if(form) {
          form.submit()
        }
      }
      emit('transaction', transaction.value)
    } catch (e: any) {
      console.error('error', e)
      error.value = e?.message || e
    } finally {
      loading.value = false
    }
  }

  const decodeImage = (base64:string) => {
    if(!import.meta.env.SSR && atob) {
      return atob(base64)
    }
    return base64
  }
</script>
<style lang="scss">
.payment-generic {
  @apply card card-body card-bordered flex gap-1;
  &__name {
    @apply text-lg font-semibold;
  }
  &__icons {
    @apply flex gap-1 flex-wrap;
    .icons__img {
      @apply w-auto h-7 border;
    }
  }
  &__error {
    @apply alert alert-error;
  }
  &__action {
    @apply flex justify-end;
    .action {
      &__submit {
        @apply btn btn-primary btn-sm;
      }
    }
  }
}
</style>
