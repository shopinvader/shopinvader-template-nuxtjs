<template>
  <client-only>
    <template #fallback>
      <slot name="loading">
        <div class="checkout__loading">
          <spinner></spinner>
        </div>
      </slot>
    </template>

    <div v-if="checkoutSteps.length > 0" class="checkout">
      <div class="checkout__pending" v-if="cart?.hasPendingTransactions">
        <slot name="pending">
          {{ currentStepIndex }}
          <h1>{{ $t('cart.pending.title') }}</h1>
          <p>{{ $t('cart.pending.checkout') }}</p>
          <nuxt-link :to="{ path: '/cart' }" class="btn-primary btn">
            {{ $t('cart.pending.back') }}
          </nuxt-link>
        </slot>
      </div>
      <template v-else-if="lineCount > 0">
        <div v-if="currentStepIndex != null" class="checkout__header">
          <slot name="header" :displayedSteps="displayedSteps">
            <ul class="checkout-stepper">
              <li
                v-for="(step, index) in displayedSteps"
                :key="step.name"
                class="step"
                :class="{ 'step--active': step.position == currentStepIndex }"
                @click="goToStep(index)"
              >
                <span class="step__index">
                  {{ step.position }}
                </span>
                <span class="step__title">
                  {{ step.title }}
                </span>
              </li>
            </ul>
          </slot>
        </div>
        <div class="checkout__body">
          <slot name="body" :steps="checkoutSteps">
            <div class="checkout-steps">
              <div
                v-for="(step, index) in checkoutSteps"
                :key="step.name"
                :class="[
                  'checkout-step',
                  {
                    'checkout-step--done': index < currentStepIndex,
                    'checkout-step--active': index == currentStepIndex
                  }
                ]"
              >
                <div v-if="step.title" class="checkout-step__header">
                  <div class="header" @click="goToStep(index)">
                    <div class="header__name">
                      <span class="name__index">
                        {{ step.position }} {{ currentStepIndex }}
                      </span>
                      <span class="name__title">
                        {{ step.title }}
                      </span>
                    </div>
                    <div class="header__icon">
                      <button
                        v-if="index < currentStepIndex"
                        type="button"
                        class="btn-ghost btn"
                        @click="goToStep(index)"
                      >
                        {{ $t('cart.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  class="checkout-step__component"
                  :class="`step-${step.name}`"
                >
                  <slot :name="`step-${step.name}`">
                    <component
                      :is="step.component"
                      v-if="index <= currentStepIndex"
                      :active="index == currentStepIndex"
                      @back="back"
                      @next="next"
                      @change="change"
                    ></component>
                  </slot>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </template>
      <div v-else class="checkout__empty">
        <slot name="empty">
          <cart-empty></cart-empty>
        </slot>
      </div>
      <div class="checkout__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </client-only>
</template>
<script lang="ts">
interface checkoutStep {
  name: string
  title: string | null
  component: Component
  position: number
}
import CheckoutLogin from '~/components/cart/checkout/CheckoutLogin.vue'
import CheckoutAddress from '~/components/cart/checkout/CheckoutAddress.vue'
import CheckoutDelivery from '~/components/cart/checkout/CheckoutDelivery.vue'
import CheckoutPayment from '~/components/cart/checkout/CheckoutPayment.vue'
import CartEmpty from '../CartEmpty.vue'
import SpinnerVue from '~/components/global/Spinner.vue'
export default defineNuxtComponent({
  name: 'Checkout',
  emits: ['change', 'next', 'back'],
  components: {
    'checkout-login': CheckoutLogin,
    'cart-empty': CartEmpty,
    spinner: SpinnerVue
  },
  props: {
    steps: {
      type: Array as PropType<checkoutStep[]>,
      default: () => []
    }
  },
  setup(props) {
    const service = useShopinvaderServices()
    const cart = service?.cart?.getCart() || ref(null)
    const i18n = useI18n()

    let defaultSteps: checkoutStep[] = [
      {
        name: 'login',
        title: null,
        component: CheckoutLogin,
        position: 100
      },
      {
        name: 'address',
        title: i18n.t('cart.address.title'),
        component: CheckoutAddress,
        position: 100
      },
      {
        name: 'delivery',
        title: i18n.t('cart.delivery.method.title'),
        component: CheckoutDelivery,
        position: 200
      },
      {
        name: 'payment',
        title: 'Payment',
        component: CheckoutPayment,
        position: 300
      }
    ]
    /** Merge props steps with default steps */
    const checkoutSteps = [...defaultSteps, ...(props?.steps || [])]
      .sort((a, b) => a.position - b.position)
      .map((step, index) => {
        step.position = index
        return step
      })
    const currentStepIndex = ref(3 as number)
    const maxStepIndex = ref(3 as number)
    return {
      maxStepIndex,
      currentStepIndex,
      checkoutSteps,
      cart
    }
  },
  computed: {
    displayedSteps() {
      /** Get steps with title */
      return this.checkoutSteps.filter((step) => step?.title)
    },
    lineCount() {
      return this.cart?.lines?.length || 0
    }
  },
  methods: {
    /**
     * Go to the previous step
     */
    back() {
      this.currentStepIndex - 1 < 0
        ? (this.currentStepIndex = 0)
        : this.currentStepIndex--
      this.$emit('back', { currentStepIndex: this.currentStepIndex })
    },
    /**
     * Go to the next step
     */
    next() {
      this.currentStepIndex + 1 < 0
        ? (this.currentStepIndex = 0)
        : this.currentStepIndex++
      if (this.maxStepIndex < this.currentStepIndex) {
        this.maxStepIndex = this.currentStepIndex
      }
      this.$emit('next', { currentStepIndex: this.currentStepIndex })
    },
    /**
     * go to a specific step
     * @param step
     */
    goToStep(step: number) {
      if (step > this.maxStepIndex) return
      this.currentStepIndex = step
      this.$emit('next', { currentStepIndex: this.currentStepIndex })
    },
    change() {
      this.$emit('change')
    }
  }
})
</script>

<style lang="scss">
.checkout {
  &__header {
    @apply hidden w-full border-b py-6 md:block;
    .checkout-stepper {
      @apply flex w-full flex-row justify-center  md:gap-8;

      .step {
        @apply flex gap-2 text-center font-light uppercase text-gray-400;

        &--active {
          @apply font-bold text-primary;
        }
        &:not(:last-child)::after {
          content: '-';
          @apply pl-4 font-light text-gray-400;
        }
      }
    }
  }

  &__body {
    @apply py-5;
    .checkout-login {
      @apply flex justify-center;
      .cart-login__form {
        @apply w-96 py-10;
      }
    }
    .checkout-steps {
      @apply flex flex-col;
      .checkout-step {
        @apply mb-2 py-2;

        &--done,
        &--active {
          &:last-child {
          }

          .checkout-step {
            &__header {
              .header {
                @apply flex items-center justify-between;
                &__name {
                  @apply text-secondary;
                }
              }
            }
            &__component {
              @apply block py-2;
            }
          }
        }
        &--done {
          @apply border-b;
          .checkout-step {
            &__header {
              .header {
                &__name {
                  @apply text-primary;
                }
              }
            }
          }
        }
        &--active {
          animation: checkoutStep 0.3s ease-in-out forwards;
        }
        &__header {
          .header {
            @apply hidden;

            &__name {
              @apply flex text-xl font-bold uppercase text-gray-400;
              .name__index {
                @apply hidden;
              }
            }
          }
        }
        &__component {
          @apply hidden;
        }
      }
    }
  }
  &__empty {
    @apply flex h-96 items-center justify-center text-xl;
  }
  &__loading {
    @apply flex h-96 flex-col items-center justify-center;
  }
  &__pending {
    @apply flex h-96  flex-col items-center justify-center py-10;
    p {
      @apply max-w-2xl  animate-pulse pb-10 text-center text-lg;
    }
  }
}
@keyframes checkoutStep {
  0% {
    opacity: 0;
    filter: blur(10px);
    transform: translateY(25%);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}
</style>
