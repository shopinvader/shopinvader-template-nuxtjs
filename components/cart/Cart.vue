<template>
  <div class="cart">
    <client-only>
      <template v-if="cart && lineCount > 0 && !loading">
        <div class="cart__message">
          <!-- @slot Pending state and warning message content  -->
          <slot name="message" :cart="cart">
            <div v-if="hasPendingTransactions" class="message">
              <icon name="info" class="icon"></icon>
              {{ t('cart.pending.checkout') }}
            </div>
          </slot>
        </div>
        <div class="cart__lines">
          <!-- @slot Cart's lines content  -->
          <slot name="lines" :lines="cart?.lines">
            <cart-lines :lines="cart?.lines"></cart-lines>
          </slot>
          <!-- @slot After lines content  -->
          <slot name="lines-footer"></slot>
        </div>
        <div class="cart__coupon">
          <!-- @slot Cart coupon block content  -->
          <slot name="coupon" :cart="cart">
            <cart-coupon></cart-coupon>
          </slot>
        </div>
        <div class="cart__total">
          <!-- @slot Cart total block content  -->
          <slot name="total" :cart="cart">
            <cart-total class="">
              <template #footer>
                <div
                  class="total__checkout"
                  :class="{ 'tooltip tooltip-primary': cartError }"
                  :data-tip="cartError"
                >
                  <button type="button" class="checkout__btn" @click="onNextStep">
                    {{ t('cart.summary.checkout') }}
                    <icon name="right" class="text-lg"></icon>
                  </button>
                </div>
              </template>
            </cart-total>
          </slot>
        </div>
      </template>
      <div v-else-if="cart && lineCount == 0 && !loading" class="cart__empty">
        <!-- @slot empty cart content -->
        <slot name="empty">
          <cart-empty></cart-empty>
        </slot>
      </div>
      <div v-else class="cart__loading">
        <!-- @slot loading content -->
        <slot name="loading">
          <spinner></spinner>
        </slot>
      </div>
      <template #fallback>
        <div class="cart__loading">
          <!-- @slot loading content -->
          <slot name="loading">
            <spinner></spinner>
          </slot>
        </div>
      </template>
    </client-only>
  </div>
</template>
<script lang="ts" setup>
import type { Cart } from '#models'
const emits = defineEmits(['next'])
const { t } = useI18n()
const loading = ref(false)
const hasPendingTransactions = ref(false)
const cartService = useShopinvaderService('cart')
const cart = cartService.getCart()
let timer: any = null

watch(
  () => cart.value,
  (c: Cart | null) => {
    const pendingTransaction = c?.hasPendingTransactions || false
    if (!pendingTransaction) {
      hasPendingTransactions.value = false
      if (timer) clearTimeout(timer)
    } else {
      timer = setTimeout(() => {
        hasPendingTransactions.value = true
      }, 2000)
    }
  },
  { immediate: true }
)

const lineCount = computed(() => cart?.value?.lines?.length || 0)
const onNextStep = () => {
  if (!hasPendingTransactions.value && cart.value?.isReadyToConfirm()) {
    emits('next')
  }
}

const cartError = computed(() => {
  if (cart.value?.hasPendingTransactions) {
    return t('cart.pending.checkout')
  }
  if (!cart.value?.isReadyToConfirm()) {
    return t('cart.summary.error')
  }
  return null
})

useHead({
  title: t('cart.title')
})

onMounted(() => {
  if (!cart.value?.id) {
    cartService.sync()
  }
})
</script>
<style lang="scss">
.cart {
  @apply grid h-full grid-cols-3 gap-4 py-5;
  grid-template-rows: auto auto 1fr;
  &__loading {
    @apply col-span-3 flex h-64 items-center justify-center;
  }
  &__message {
    @apply col-span-3 py-3;
    .message {
      @apply alert;
      .icon {
        @apply text-xl text-info;
      }
    }
  }
  &__lines {
    @apply col-span-3 row-span-2 xl:col-span-2;
    .cart-lines {
      @apply w-full;
    }
  }
  &__coupon {
    @apply col-span-3 col-start-1 md:col-span-1 lg:col-start-2 xl:col-start-3;
    .total {
      &__checkout {
        @apply w-full;
        .checkout__btn {
          @apply btn btn-secondary mt-6 w-full;
        }
      }
    }
  }
  &__total {
    @apply col-span-3 md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-3;
    .total {
      &__checkout {
        @apply w-full;
        .checkout__btn {
          @apply btn btn-secondary mt-6 w-full;
        }
      }
    }
  }
  &__empty {
    @apply col-span-3 flex items-center justify-center p-10;
  }
}
</style>
