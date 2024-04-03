<template>
  <div class="cart">
    <client-only>
      <template v-if="cart && lineCount > 0 && !loading">
        <div class="cart__message">
          <!-- @slot Pending state and warning message content  -->
          <slot name="message" :cart="cart">
            <div v-if="hasPendingTransactions" class="message">
              <icon name="info" class="icon"></icon>
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
                <div class="total__checkout" :class="{'tooltip tooltip-primary ':cart?.hasPendingTransactions}" :data-tip="cart?.hasPendingTransactions && $t('cart.pending.checkout')">
                  <button
                    type="button"
                    class="checkout__btn"
                    @click="!cart?.hasPendingTransactions && $emit('next')"
                  >
                    {{ $t('cart.summary.checkout') }}
                    <icon
                      name="right"
                      class="text-lg"
                    ></icon>
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
<script lang="ts">
import CartLines from '~/components/cart/CartLines.vue'
import CartTotal from '~/components/cart/CartTotal.vue'
import CartEmpty from '~/components/cart/CartEmpty.vue'
import Spinner from '~/components/global/Spinner.vue'
import { Cart } from '~~/models'
let timer:any = null
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
    lineCount(): number {
      return this.cart?.lines?.length || 0
    }
  },
  setup() {
    const i18n = useI18n()
    const loading = ref(false)
    const hasPendingTransactions = ref(false)
    const cartService = useShopinvaderService('cart')
    const cart = cartService.getCart()
    useHead({
      title: i18n.t('cart.title')
    })
    return {
      cart,
      loading,
      hasPendingTransactions,
    }
  },
  watch: {
    cart: {
      handler(cart: Cart) {
        const hasPendingTransactions = cart?.hasPendingTransactions || false
        if (!hasPendingTransactions) {
          this.hasPendingTransactions = false
          if(timer) clearTimeout(timer)
        } else {
          timer = setTimeout(() => {
            this.hasPendingTransactions = true
          }, 2000);
        }

      },
      immediate: true
    }
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
    @apply col-span-3 xl:col-span-2 row-span-2;
    .cart-lines {
      @apply w-full;
    }
  }
  &__coupon {
    @apply col-span-3 md:col-start-2 md:col-span-2 lg:col-start-3 lg:col-span-1;
    .total {
      &__checkout {
        @apply w-full;
        .checkout__btn {
          @apply btn-secondary btn mt-6 w-full;
        }
      }
    }
  }
  &__total {
    @apply col-span-3 md:col-start-2 md:col-span-2 lg:col-start-3 lg:col-span-1;
    .total {
      &__checkout {
        @apply w-full;
        .checkout__btn {
          @apply btn-secondary btn mt-6 w-full;
        }
      }
    }
  }
  &__empty {
    @apply col-span-3 flex items-center justify-center p-10;
  }
}
</style>
