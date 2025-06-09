<template>
  <UDrawer
    v-if="product"
    v-model:open="isOpen"
    direction="right"
    :ui="ui?.components?.drawer"
  >
    <slot name="default" /> 
    <template #content>
      <UCard :ui="ui?.components?.card" :class="ui.root({ class: 'cart-confirmation' })">
        <template #header>
          <slot name="header" :line="line" :product="product">
            <div :class="ui.header({ class: 'cart-confirmation__header'})">
              {{ t('cart.title') }}
            </div>
          </slot>
        </template>
        <div :class="ui.line({ class: 'cart-confirmation__line'})">
          <slot name="line" :line="line" :product="product">
            <div :class="ui.lineTitle({ class: 'line_title'})">
              <icon name="check" class="icon" />
              {{ t('cart.confirmation') }}
            </div>
            <cart-line v-if="line" class="content__line" :line="line" :readonly="true"> </cart-line>    
          </slot>
        </div>
        <div :class="ui.links({ class: 'cart-confirmation__links'})">
          <slot name="product-link" :line="line" :product="product">
            <product-links
              v-if="product"
              :links="product.links?.crossLink || []"
              :ui="ui?.components?.productLinks"
            >
              <template #head>
                <h2 class="text-xl">{{ t('product.cross_selling.title') }}</h2>
              </template>
            </product-links>
          </slot>
        </div>
        <template #footer>
          <div :class="ui.footer({ class: 'cart-confirmation__footer'})">
            <slot name="footer" :line="line" :product="product">
              <UButton type="button" variant="outline" size="lg" color="neutral" :class="ui.back({ class: 'cart-confirmation-back'})" @click="isOpen = false">
                {{ t('cart.continue') }}
              </UButton>
              <UButton size="lg" @click="gotToCart" :class="ui.checkout({ class: 'cart-confirmation-checkout'})">
                <icon name="cart" />
                {{ t('cart.checkout') }}
              </UButton>
            </slot>
          </div>
        </template>
      </UCard>
    </template>
  </UDrawer>
</template>
<script lang="ts">
import theme, { type ProductCartConfirmationUI } from '~/theme/ProductCartConfirmation'
import type { CartLine, Product } from '#models'

export interface ProductCartConfirmationProps {
  product?: Product | null
  opened?: boolean
  ui?: ProductCartConfirmationUI
}
export interface ProductCartConfirmationSlots {
  default?: (props: { line: CartLine | null, product: Product | null }) => any
  header?: (props: { line: CartLine | null, product: Product | null }) => any
  line?: (props: { line: CartLine | null, product: Product | null }) => any
  'product-link'?: (props: { line: CartLine | null, product: Product | null }) => any
  footer?: (props: { line: CartLine | null, product: Product | null }) => any
}
</script>
<script  lang="ts" setup>
const props = defineProps<ProductCartConfirmationProps>()
defineSlots<ProductCartConfirmationSlots>()

const cartService = useShopinvaderService('cart')
const isOpen = ref(props.opened || false)
const ui = componentUI('ProductCartConfirmation', theme, props?.ui)({})
const localePath = useLocalePath()
const { t } = useI18n()

const gotToCart = () => {
  isOpen.value = false
  navigateTo(localePath('cart') || 'cart')
}

const line = computed(() => {
  const cart = cartService.getCart()
  return cart?.value?.lines?.find((line: CartLine) => line.productId === props.product?.id) || null
})

watch(() => props.opened, (opened) => {
  isOpen.value = opened
})
</script>