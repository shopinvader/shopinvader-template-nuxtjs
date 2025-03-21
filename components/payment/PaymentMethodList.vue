<template>
  <div class="payment-list">
    <div v-if="error" class="payment-list__error">
      {{ error }}
    </div>
    <template v-if="!loading">
      <form
        v-if="!transaction"
        class="payment-list__form"
        method="post"
        @submit.prevent="createTransaction"
      >
        <template v-if="modes?.length > 0">
          <slot v-for="mode in modes" :name="`${mode.code}-mode`" :mode="mode">
            <label
              :key="mode.id"
              class="form__item"
              :class="{ 'form__item--selected': mode === selectedPaymentMethod }"
            >
              <div class="item__name">
                <input
                  type="radio"
                  name="payment"
                  class="radio"
                  :value="mode"
                  v-model="selectedPaymentMethod"
                />
                {{ mode.name }}
                <div v-if="mode.state == 'test'" class="badge badge-accent">
                  {{ mode.state }}
                </div>
              </div>
              <div v-if="mode.icons?.length > 0" class="item__icons">
                <img
                  v-for="icon in mode.icons"
                  :key="icon.sequence"
                  :src="`data:image/png;base64,${decodeImage(icon.image)}`"
                  :alt="icon.name"
                  class="icons__img"
                />
              </div>
              <div class="item__form">
                <slot :name="`${mode.code}-form`" :mode="mode">
                  <div
                    v-if="mode.expressCheckoutFormViewRendered"
                    v-html="mode.expressCheckoutFormViewRendered"
                  ></div>
                  <div
                    v-if="mode.inlineFormViewRendered"
                    v-html="mode.inlineFormViewRendered"
                  ></div>
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
          <icon name="error" class="empty__icon" />
          <div class="empty__label">
            {{ t('cart.payment.empty') }}
          </div>
        </div>
        <div class="payment-list__submit">
          <div class="terms-optin">
            <label>
              <input type="checkbox" v-model="legals" class="checkbox" required />
              <i18n-t tag="span" keypath="payment.legals.intro" class="label-text pl-1">
                <template #link>
                  <NuxtLinkLocale to="/legals/terms" class="text-nuxt-lightgreen" target="_blank">
                    {{ t('payment.legals.link') }}
                  </NuxtLinkLocale>
                </template>
              </i18n-t>
            </label>
          </div>
          <div :class="{ tooltip: !legals }" :data-tip="!legals ? t('payment.legals.help') : ''">
            <button
              v-if="modes?.length > 0"
              type="submit"
              class="btn"
              :class="{ 'btn-primary': selectedPaymentMethod && legals }"
              :disabled="!selectedPaymentMethod || !legals"
            >
              {{ t('payment.select', { amount: paymentData.amountFormatted }) }}
            </button>
          </div>
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
import type { PaymentData, PaymentMethod, PaymentTransaction } from '#models'
const props = defineProps({
  paymentData: {
    type: Object as PropType<PaymentData>,
    required: true
  }
})
const { t } = useI18n()
const PaymentGeneric = resolveComponent('PaymentGeneric')

const importPaymentComponent = async (name: string) => {
  name = name.charAt(0).toUpperCase() + name.slice(1)
  return await defineAsyncComponent(
    async () =>
      await import(`../payment/Payment${name}.vue`).catch(() => {
        return PaymentGeneric
      })
  )
}
const legals = ref(false)
const loading = ref(false)
const modes = ref<PaymentMethod[]>([])
const error = ref(null)
const selectedPaymentMethod = ref<PaymentMethod | null>(null)
const transaction = ref<PaymentTransaction | null>(null)
const transactionComponent = ref<any>(null)
const req = useRequestURL()
const localePath = useLocalePath()
const paymentService = useShopinvaderService('payment')
onMounted(async () => {
  loading.value = true
  try {
    if (!paymentService) {
      throw new Error('Payment service not available')
    }
    let payable = null
    if (props && props.paymentData) {
      payable = props.paymentData.payable
    }
    if (!payable) {
      throw new Error('Payable not available')
    }
    modes.value = await paymentService.getPaymentMethods(payable)
    if (modes.value.length > 0) {
      selectedPaymentMethod.value = modes.value[0]
    }
  } catch (e: any) {
    error.value = e
    console.error(e)
  } finally {
    loading.value = false
  }
})
const decodeImage = (base64: string) => {
  if (!import.meta.env.SSR && atob) {
    return atob(base64)
  }
  return base64
}
const createTransaction = async () => {
  loading.value = true
  try {
    if (!paymentService) {
      throw new Error('Payment service not available')
    }
    if (!selectedPaymentMethod.value) {
      throw new Error('No payment method selected')
    }
    const inputs: any[] = []
    const url = `${req.origin}${localePath({ path: `/checkout/validated` })}`
    transaction.value = await paymentService.createTransaction(
      props.paymentData,
      selectedPaymentMethod.value,
      inputs,
      url
    )
    transactionComponent.value = await importPaymentComponent(selectedPaymentMethod.value.code)
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
    @apply flex h-40 items-center justify-center;
  }
  &__empty {
    @apply flex flex-col items-center justify-center gap-1 p-5 text-center;
    .empty__icon {
      @apply text-6xl text-error;
    }
    .empty__label {
      @apply max-w-lg text-center text-lg;
    }
  }
  &__form {
    @apply flex flex-col gap-2;
    .form {
      &__item {
        @apply card card-body card-compact flex cursor-pointer border p-4;
        &--selected {
          @apply border-2 border-primary-500 shadow-sm shadow-primary-400;
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
            @apply flex flex-wrap gap-1;
            .icons__img {
              @apply h-7 w-auto border;
            }
          }
        }
      }
    }
  }
  &__submit {
    @apply flex flex-wrap justify-end gap-8 py-3;
    .terms-optin {
      @apply form-control;
      label {
        @apply label cursor-pointer;
      }
      a {
        @apply underline;
      }
    }
    .btn {
      @apply px-6;
    }
  }
}
</style>
