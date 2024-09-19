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
          <h1>{{ t('cart.pending.title') }}</h1>
          <p>{{ t('cart.pending.checkout') }}</p>
          <nuxt-link :to="localePath('/cart')" class="btn btn-primary">
            {{ t('cart.pending.back') }}
          </nuxt-link>
        </slot>
      </div>
      <template v-else-if="lineCount > 0">
        <div v-if="activeStep != null" class="checkout__header">
          <!-- @slot Header content  -->
          <slot name="header" :displayed-steps="displayedSteps">
            <ul class="checkout-stepper">
              <li
                v-for="step in displayedSteps"
                :key="step.name"
                class="step"
                :class="{
                  'step--done': step.done,
                  'step--active': step.active
                }"
                @click="goToStep(step)"
              >
                <span class="step__index">
                  <icon name="check" v-if="step.done" />
                  <template v-else>{{ step.index }}</template>
                </span>
                <span class="step__title"> {{ step.title }}</span>
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
                {{ t('cart.title') }}
              </nuxt-link>
              <span class="body__count">
                {{ t('cart.line.count', { count: lineCount }) }}
              </span>
            </div>
            <div class="cart__end">
              <button
                type="button"
                class="btn btn-circle btn-ghost"
                :title="displayCart ? t('cart.line.hide') : t('cart.line.view')"
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
                v-for="step in checkoutSteps"
                :key="step.name"
                :id="'step-' + step.position"
                :class="[
                  'checkout-step',
                  {
                    'checkout-step--done': step.done,
                    'checkout-step--active': step.active
                  }
                ]"
              >
                <div v-if="step.title" class="checkout-step__header">
                  <div class="header" @click="goToStep(step)">
                    <div class="header__name">
                      <span class="name__index">
                        <icon name="check" v-if="step.done" />
                        <template v-else>{{ step.index }}</template>
                      </span>
                      <span class="name__title">
                        {{ step.title }}
                      </span>
                    </div>
                    <div class="header__icon">
                      <button
                        v-if="step.done"
                        type="button"
                        class="btn btn-ghost"
                        @click="goToStep(step)"
                      >
                        {{ t('cart.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="checkout-step__component" :class="`step-${step.name}`">
                  <slot :name="`step-${step.name}`">
                    <component
                      :is="step.component"
                      v-if="step.active || step.done"
                      :active="step.active"
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
<script lang="ts" setup>
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
  done?: boolean
  active?: boolean
  index?: number
  id?: number
}

/**
 * Checkout component.
 * This component is used to display the checkout process.
 * It is composed of several steps.
 * Each step is a component.
 * a checkoutStep need to have a name, a title, a component and a position.
 */

const emit = defineEmits(['next', 'back', 'change'])
const props = defineProps({
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
})

const localePath = useLocalePath()
const cartService = useShopinvaderService('cart')
const cart = cartService?.getCart() || ref(null)
const { t } = useI18n()
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
    title: t('cart.address.title'),
    component: CartCheckoutAddress,
    position: 100
  },
  {
    name: 'delivery',
    title: t('cart.delivery.method.title'),
    component: CartCheckoutDelivery,
    position: 200
  },
  {
    name: 'payment',
    title: t('cart.payment.title'),
    component: CartCheckoutPayment,
    position: 300
  }
]
/** Merge props steps with default steps */
let items = [...defaultSteps]
if (props.mergeSteps) {
  items = [...defaultSteps, ...props.steps]
    .reduce((steps, item) => {
      steps[item?.position] = item
      return steps
    }, [] as checkoutStep[])
    .filter((step) => step?.component)
} else if (props.steps) {
  items = props.steps
}
let index = 0
items = items.map((step, i) => {
  index = step?.title ? index + 1 : index
  return {
    ...step,
    id: i,
    index
  }
})
const activeStep = ref(items[0])
const checkoutSteps = computed(() => {
  return items.map((step) => {
    return {
      ...step,
      done: step.position < activeStep.value?.position,
      active: step.id === activeStep.value?.id
    }
  })
})

const displayedSteps = computed(() => {
  /** Get steps with title */
  return checkoutSteps.value.filter((step) => step?.title)
})

const lineCount = computed(() => {
  return cart?.value?.lines?.length || 0
})

const currentStepIndex = computed(() => {
  return checkoutSteps.value.findIndex((step) => step.active)
})

watch(
  () => activeStep.value,
  (step, prevStep) => {
    if (step && prevStep !== step) {
      scrollToStep(step.position)
      const title = t('cart.title')
      scrollToStep(step.position)
      useHead({
        title: `${step.title} - ${title}`
      })
    }
  },
  { deep: true }
)
/**
 * Go to the previous step
 */
const back = () => {
  let currentStepIndex = checkoutSteps.value.findIndex((step) => step.active)
  if (currentStepIndex - 1 < 0) {
    currentStepIndex = 0
  } else if (checkoutSteps.value[currentStepIndex - 1]) {
    currentStepIndex--
  }
  activeStep.value = checkoutSteps.value[currentStepIndex]
  emit('back', { currentStepIndex })
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * Go to the next step
 */
const next = () => {
  let currentStepIndex = checkoutSteps.value.findIndex((step) => step.active)
  if (currentStepIndex + 1 < 0) {
    currentStepIndex = 0
  } else if (checkoutSteps.value[currentStepIndex + 1]) {
    currentStepIndex++
  }
  activeStep.value = checkoutSteps.value[currentStepIndex]

  if (currentStepIndex === checkoutSteps.value.length) {
    emit('next', { currentStepIndex })
  }
}

/**
 * go to a specific step
 * @param step
 */
const goToStep = (value: checkoutStep) => {
  emit('change')
  const step = checkoutSteps.value.find((s) => s.id == value.id)
  if (step && value.done) {
    activeStep.value = step
  }
}

const scrollToStep = (position: number) => {
  const el = document.querySelector(`#step-${position}`)
  if (el) {
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 900)
  }
}

const change = () => {
  emit('change')
}
</script>

<style lang="scss">
.checkout {
  @apply p-4;
  &__header {
    @apply sticky left-0 top-0 z-10 hidden w-full border-b bg-gray-50 py-4 md:block;
    .checkout-stepper {
      @apply flex w-full flex-row justify-center md:gap-8;

      .step {
        @apply flex items-center justify-center gap-2 font-light uppercase text-gray-400;
        &--done,
        &--active {
          @apply cursor-pointer;
          .step__index {
            @apply font-bold text-primary;
          }
          .step__title {
            @apply text-primary;
          }
        }
        &--done {
          .step__index {
            @apply text-primary;
            .icon {
              @apply text-sm;
            }
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
