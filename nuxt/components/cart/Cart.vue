<template>
  <div class="cart">
    <client-only>
      <template v-if="cart && lineCount > 0 && !loading">
        <div class="cart__message">
          <!-- @slot Pending state and warning message content  -->
          <slot name="message" :cart="cart">
            <div v-if="cart?.hasPendingTransactions" class="message">
              {{ $t('cart.pending.checkout') }}
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
        <div class="cart__total">
          <!-- @slot Cart total block content  -->
          <slot name="total" :cart="cart">
            <cart-total class="">
              <template #footer>
                <button
                  type="button"
                  :disabled="cart?.hasPendingTransactions"
                  class="btn-secondary btn mt-6 w-full"
                  @click="$emit('next')"
                >
                  {{ $t('cart.summary.checkout') }}
                  <icon
                    icon="material-symbols:chevron-right"
                    class="text-lg"
                  ></icon>
                </button>
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
<script lang="ts">
import CartLines from '~/components/cart/CartLines.vue'
import CartTotal from '~/components/cart/CartTotal.vue'
import CartEmpty from '~/components/cart/CartEmpty.vue'
import Spinner from '~/components/global/Spinner.vue'
import { Cart } from '~~/models'

export default defineNuxtComponent({
  name: 'Cart',
  emits: {
    /**  Emit when the user click on the next button */
    next: () => true
  },
  components: {
    'cart-lines': CartLines,
    'cart-total': CartTotal,
    'cart-empty': CartEmpty,
    spinner: Spinner
  },
  computed: {
    cart(): Cart | null {
      return useCart().value
    },
    lineCount(): number {
      return this.cart?.lines.length || 0
    }
  },
  setup() {
    const i18n = useI18n()
    const loading = ref(false)
    useHead({
      title: i18n.t('cart.title')
    })
    return {
      loading
    }
  }
})
</script>
<style lang="scss">
.cart {
  @apply grid h-full grid-cols-3 gap-4 py-5;
  &__loading {
    @apply col-span-3 flex h-64 items-center justify-center;
  }
  &__message {
    @apply col-span-3 py-3;
    .message {
      @apply w-full bg-error p-2 text-white;
    }
  }
  &__lines {
    @apply col-span-3 lg:col-span-2;
    .cart-lines {
      @apply w-full;
    }
  }
  &__total {
    @apply col-span-3 lg:col-span-1;
  }
  &__empty {
    @apply col-span-3 flex items-center justify-center p-10;
  }
}
</style>
