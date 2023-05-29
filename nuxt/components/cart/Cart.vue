<template>
  <div class="cart">
    <template v-if="cart && lineCount > 0">
      <div class="cart__message">
        <slot name="message" :cart="cart">
          <div v-if="cart?.hasPendingTransactions" class="message">
            {{ $t('cart.pending.checkout') }}
          </div>
        </slot>
      </div>
      <div class="cart__lines">
        <slot name="lines" :lines="cart?.lines">
          <cart-lines :lines="cart?.lines"></cart-lines>
        </slot>
        <slot name="lines-footer"></slot>
      </div>
      <div class="cart__total">
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
    <div v-else class="cart__empty">
      <cart-empty></cart-empty>
    </div>
  </div>
</template>
<script lang="ts">
import CartLines from '~/components/cart/CartLines.vue'
import CartTotal from '~/components/cart/CartTotal.vue'
import CartEmpty from '~/components/cart/CartEmpty.vue'
import { Cart } from '~~/models'

export default defineNuxtComponent({
  name: 'Cart',
  emits: ['next'],
  components: {
    'cart-lines': CartLines,
    'cart-total': CartTotal,
    'cart-empty': CartEmpty
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
    useHead({
      title: i18n.t('cart.title')
    })
  }
})
</script>
<style lang="scss">
.cart {
  @apply grid h-full gap-4 py-5 lg:grid-cols-3;
  &__message {
    @apply col-span-3 py-3;
    .message {
      @apply w-full bg-error p-2 text-white;
    }
  }
  &__lines {
    @apply w-full lg:col-span-2;
    .cart-lines {
      @apply w-full;
    }
  }
  &__total {
    @apply w-full lg:col-span-1;
  }
  &__empty {
    @apply flex w-full items-center  justify-center p-10;
  }
}
</style>
