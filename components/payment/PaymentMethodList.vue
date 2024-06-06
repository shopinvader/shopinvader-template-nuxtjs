<template>
  <div class="payment-list">
    <div v-if="error" class="payment-list__error">
      {{ error }}
    </div>
    <template v-if="!loading">
      <form v-if="!transaction" class="payment-list__form" method="post" @submit.prevent="createTransaction">
        <template v-if="modes?.length > 0">
          <slot v-for="mode in modes" :name="`${mode.code}-mode`" :mode="mode">
            <label
              :key="mode.id"
              class="form__item"
              :class="{ 'form__item--selected': mode === selected}"
            >
              <div class="item__name">
                <input type="radio" name="payment" class="radio" :value="mode" v-model="selected" />
                {{ mode.name }}
                <div v-if="mode.state == 'test'" class="badge badge-accent">
                  {{ mode.state }}
                </div>
              </div>
              <div v-if="mode.icons?.length > 0" class="item__icons">
                <img
                  v-for="icon in mode.icons"
                  :src="`data:image/png;base64,${decodeImage(icon.image)}`"
                  :alt="icon.name"
                  class="icons__img"
                />
              </div>
              <div class="item__form">
                <slot :name="`${mode.code}-form`" :mode="mode">
                  <div v-if="mode.expressCheckoutFormViewRendered" v-html="mode.expressCheckoutFormViewRendered"></div>
                  <div v-if="mode.inlineFormViewRendered" v-html="mode.inlineFormViewRendered"></div>
                </slot>
              </div>
              <div class="item__desc">
                <slot name="desc" :method="mode">
                  {{ mode.payableReference }}
                </slot>
              </div>
            </label>
          </slot>
        </template>
        <div v-else class="payment-list__empty">
          <icon name="error" class="empty__icon"/>
          <div class="empty__label">
            {{ $t('cart.payment.empty') }}
          </div>
        </div>
        <div class="flex justify-end py-3">
          <button
            v-if="modes?.length > 0"
            type="submit"
            class="btn"
            :class="{'btn-primary': selected}"
            :disabled="!selected"
          >
            {{ $t('payment.select', { amount: paymentData.amountFormatted }) }}
          </button>
        </div>
      </form>
      <div v-else class="payment-list__transaction">
        <template v-if="transaction && transactionComponent">
          <component :is="transactionComponent" :transaction="transaction" />
        </template>
      </div>
    </template>
    <template v-else>
      <div class="payment-list__loading">
        <spinner></spinner>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import type { PaymentData, PaymentMethod } from '#models'
  const props = defineProps({
    paymentData: {
      type: Object as PropType<PaymentData>,
      required: true
    }
  })
  const PaymentGeneric = resolveComponent('PaymentGeneric')

  const importPaymentComponent = async (name: string) => {
    name = name.charAt(0).toUpperCase() + name.slice(1)
    return await defineAsyncComponent(async () =>
      await import(`../payment/Payment${name}.vue`).catch(() => {
        return PaymentGeneric
      })
    )
  }

  const loading = ref(false)
  const modes = ref([]) as Ref<PaymentMethod[]>
  const error = ref(null)
  const selected = ref(null) as Ref<PaymentMethod | null>
  const transaction = ref(null)
  const transactionComponent = ref(null)
  const req = useRequestURL()
  const localePath = useLocalePath()
  const paymentService = useShopinvaderService('payment')
  onMounted(async () => {
    loading.value = true
    try {
      if(!paymentService) {
        throw new Error('Payment service not available')
      }
      const { payable = null } = props?.paymentData
      if(!payable) {
        throw new Error('Payable not available')
      }
      modes.value = await paymentService.getPaymentMethods(payable)
    } catch (e: any) {
      error.value = e
      console.error(e)
    } finally {
      loading.value = false
    }
  })
  const decodeImage = (base64:string) => {
    if(!import.meta.env.SSR && atob) {
      return atob(base64)
    }
    return base64
  }
  const createTransaction = async () => {
    loading.value = true
    try {
      if(!paymentService) {
        throw new Error('Payment service not available')
      }
      const inputs = []
      const url = `${req.origin}${localePath({ path:`/checkout/validated`})}`
      transaction.value = await paymentService.createTransaction(
        props.paymentData,
        selected.value,
        inputs,
        url
      )
      transactionComponent.value = await importPaymentComponent(selected.value.code)
    } catch (e: any) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
</script>
<style lang="scss" scoped>
  .payment-list {
    @apply flex flex-col gap-4;
    &__error {
      @apply alert alert-error;
    }
    &__loading {
      @apply flex justify-center items-center h-40;
    }
    &__empty {
      @apply flex flex-col items-center justify-center gap-1 p-5 text-center;
      .empty__icon {
        @apply text-6xl text-error;
      }
      .empty__label {
        @apply text-center max-w-lg text-lg;
      }
    }
    &__form {
      @apply flex flex-col gap-2;
      .form {
        &__item {
          @apply card card-body p-4 card-compact border flex cursor-pointer;
          &--selected {
            @apply border-2 shadow-sm shadow-primary-400 border-primary-500;
            .radio {
              @apply bg-primary-500;
            }
          }
        .item {
            &__name {
              @apply flex items-center gap-2 text-lg font-semibold;
            }
            &__desc {
              @apply text-sm;
            }
            &__icons {
              @apply flex gap-1 flex-wrap;
              .icons__img {
                @apply w-auto h-7 border;
              }
            }
          }
        }
      }
    }
  }
</style>
