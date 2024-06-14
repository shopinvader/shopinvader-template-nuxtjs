<template>
  <client-only>
    <template #fallback>
      <!-- @slot Content before component loading  -->
      <slot name="loading">
        <div class="checkout__loading">
          <spinner></spinner>
        </div>
      </slot>
    </template>
    <div v-if="checkoutSteps.length > 0" class="checkout">
      <div v-if="cart?.hasPendingTransactions" class="checkout__pending">
        <!-- @slot Pending state and warning message content  -->
        <slot name="pending">
          <h1>{{ $t('cart.pending.title') }}</h1>
          <p>{{ $t('cart.pending.checkout') }}</p>
          <nuxt-link :to="localePath('/cart')" class="btn btn-primary">
            {{ $t('cart.pending.back') }}
          </nuxt-link>
        </slot>
      </div>
      <template v-else-if="lineCount > 0">
        <div v-if="currentStepIndex != null" class="checkout__header">
          <!-- @slot Header content  -->
          <slot name="header" :displayed-steps="displayedSteps">
            <ul class="checkout-stepper">
              <li
                v-for="(step, index) in displayedSteps"
                :key="step.name"
                class="step"
                :class="{
                  'step--done': index + 1 < currentStepIndex,
                  'step--active': index + 1 == currentStepIndex
                }"
                @click="goToStep(index)"
              >
                <span class="step__index">
                  <icon name="check" v-if="index + 1 < currentStepIndex" />
                  <template v-else>{{ index + 1 }}</template>
                </span>
                <span class="step__title"> {{ step.title }} </span>
              </li>
            </ul>
          </slot>
        </div>
        <div class="checkout__cart">
          <!--
            @slot Cart summary content
            @binding {Cart} cart - cart
          -->
          <slot name="cart" :cart="cart">
            <div class="cart__icon">
              <icon name="solar:cart-3-bold-duotone" />
            </div>
            <div class="cart__body">
              <nuxt-link class="body__title" :to="localePath('/cart')">
                {{ $t('cart.title') }}
              </nuxt-link>
              <span class="body__count">
                {{ $t('cart.line.count', { count: lineCount }) }}
              </span>
            </div>
            <div class="cart__end">
              <button
                type="button"
                class="btn btn-circle btn-ghost"
                :title="displayCart ? $t('cart.line.hide') : $t('cart.line.view')"
                @click="displayCart = !displayCart"
              >
                <icon name="down" class="text-lg" :rotate="displayCart && '180deg'" />
              </button>
            </div>
            <div v-if="displayCart" class="cart__lines">
              <cart-lines :lines="cart?.lines" :readonly="true"></cart-lines>
            </div>
          </slot>
        </div>
        <div class="checkout__body">
          <!--
            @slot Checkout steps content
            @binding {CheckoutStep[]} steps - checkout steps
            @binding {number} currentStepIndex - current step index
          -->
          <slot name="body" :steps="checkoutSteps" :current-step-index="currentStepIndex">
            <div class="checkout-steps">
              <div
                v-for="(step, index) in checkoutSteps"
                :key="step.name"
                :id="'step-' + step.position"
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
                        <icon name="check" v-if="index < currentStepIndex" />
                        <template v-else>{{ index + 1 }}</template>
                      </span>
                      <span class="name__title">
                        {{ step.title }}
                      </span>
                    </div>
                    <div class="header__icon">
                      <button
                        v-if="index < currentStepIndex"
                        type="button"
                        class="btn btn-ghost"
                        @click="goToStep(index)"
                      >
                        {{ $t('cart.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="checkout-step__component" :class="`step-${step.name}`">
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
        <!-- @slot Empty cart content  -->
        <slot name="empty">
          <CartEmpty></CartEmpty>
        </slot>
      </div>
      <div class="checkout__footer">
        <!-- @slot Footer content  -->
        <slot name="footer"></slot>
      </div>
    </div>
  </client-only>
</template>
<script lang="ts">
import {
  CartCheckoutAddress,
  CartCheckoutDelivery,
  CartCheckoutLogin,
  CartCheckoutPayment,
  CartEmpty,
  Spinner
} from '#components'

interface checkoutStep {
  name: string
  title: string | null
  component: Component
  position: number
}

/**
 * Checkout component.
 * This component is used to display the checkout process.
 * It is composed of several steps.
 * Each step is a component.
 * a checkoutStep need to have a name, a title, a component and a position.
 */
export default defineNuxtComponent({
  name: 'Checkout',
  emits: ['change', 'next', 'back'],
  components: {
    'checkout-login': CartCheckoutLogin,
    CartEmpty: CartEmpty,
    spinner: Spinner
  },
  props: {
    /**
     * Checkout steps.
     * Used to override or merge component in the default steps list.
     * Step position is used to sort the steps and add new component between default steps.
     */
    steps: {
      type: Array as PropType<checkoutStep[]>,
      default: () => []
    },
    /**
     * Merge steps.
     * If true, steps will be merged with default steps.
     * If false, only steps will be used.
     */
    mergeSteps: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const localePath = useLocalePath()
    const cartService = useShopinvaderService('cart')
    const cart = cartService?.getCart() || ref(null)
    const i18n = useI18n()
    const displayCart = ref(false)

    /** Default steps of the checkout funnel */
    const defaultSteps: checkoutStep[] = [
      {
        name: 'login',
        title: null,
        component: CartCheckoutLogin,
        position: 0
      },
      {
        name: 'address',
        title: i18n.t('cart.address.title'),
        component: CartCheckoutAddress,
        position: 100
      },
      {
        name: 'delivery',
        title: i18n.t('cart.delivery.method.title'),
        component: CartCheckoutDelivery,
        position: 200
      },
      {
        name: 'payment',
        title: i18n.t('cart.payment.title'),
        component: CartCheckoutPayment,
        position: 300
      }
    ]
    /** Merge props steps with default steps */
    let checkoutSteps = [...defaultSteps]
    if (props.mergeSteps) {
      checkoutSteps = [...defaultSteps, ...props.steps]
        .reduce((steps, item) => {
          steps[item?.position] = item
          return steps
        }, [] as checkoutStep[])
        .filter((step) => step?.component)
    } else if (props.steps) {
      checkoutSteps = props.steps
    }
    const currentStepIndex = ref(0 as number)
    const maxStepIndex = ref(0 as number)
    return {
      maxStepIndex,
      currentStepIndex,
      checkoutSteps,
      cart,
      displayCart,
      localePath
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
  watch: {
    currentStepIndex(currentStepIndex) {
      const step = this.checkoutSteps[currentStepIndex] || null
      const title = this.$t('cart.title')
      if (step) {
        this.scrollToStep(step.position)
        useHead({
          title: `${step.title} - ${title}`
        })
      }
    }
  },
  methods: {
    /**
     * Go to the previous step
     */
    back() {
      this.currentStepIndex - 1 < 0 ? (this.currentStepIndex = 0) : this.currentStepIndex--
      this.$emit('back', { currentStepIndex: this.currentStepIndex })
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    /**
     * Go to the next step
     */
    next() {
      this.currentStepIndex + 1 < 0 ? (this.currentStepIndex = 0) : this.currentStepIndex++
      if (this.maxStepIndex < this.currentStepIndex) {
        this.maxStepIndex = this.currentStepIndex
      }
      if (this.currentStepIndex === this.checkoutSteps.length) {
        this.$emit('next', { currentStepIndex: this.currentStepIndex })
      }
    },
    /**
     * go to a specific step
     * @param step
     */
    goToStep(step: number) {
      this.$emit('change')
      if (step > this.maxStepIndex) return
      this.currentStepIndex = step
    },
    scrollToStep(step: number) {
      const el = document.querySelector(`#step-${step}`)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 900)
      }
    },
    change() {
      this.$emit('change')
    }
  }
})
</script>

<style lang="scss">
.checkout {
  @apply p-4;
  &__header {
    @apply sticky left-0 top-0 z-10 hidden w-full border-b bg-white py-4 md:block;
    .checkout-stepper {
      @apply flex w-full flex-row justify-center md:gap-8;

      .step {
        @apply flex items-center justify-center gap-2 font-light uppercase text-gray-400;
        &--done,
        &--active {
          .step__index {
            @apply flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary text-xs font-bold text-primary;
          }
          .step__title {
            @apply text-primary;
          }
        }
        &--done {
          .step__index {
            @apply bg-primary text-white;
          }
        }
        &--active {
          .step__title {
            @apply font-bold text-primary;
          }
        }
        &:not(:last-child)::after {
          content: '〉';
          @apply pl-4 font-light text-gray-400;
        }
      }
    }
  }
  &__cart {
    @apply mt-3 flex flex-row flex-wrap items-center justify-start gap-2 bg-slate-100 p-3;
    .cart {
      &__icon {
        @apply text-4xl text-primary;
      }
      &__body {
        @apply flex flex-grow flex-col justify-start text-sm;
        .body {
          &__title {
            @apply font-bold text-primary;
          }
        }
      }
      &__lines {
        @apply w-full flex-grow;
        .cartline {
          @apply border-0 bg-white text-sm;
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
    @apply flex h-96 flex-col items-center justify-center py-10;
    p {
      @apply max-w-2xl animate-pulse pb-10 text-center text-lg;
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
