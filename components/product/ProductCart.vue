<template>
  
  <ProductCartConfirmation 
    :opened="cartDrawerOpened"
    :product="product" 
    :ui="ui?.components?.ProductCartConfirmation"
  >
    <template #default>
      <div v-if="product !== null" :class="ui.root({class: ['product-cart', props.class]})">
        <slot
          name="input"
          :line="line"
          :product="product"
          :qty="qty"
          :on-update-qty="updateQty"
          :disabled-add-to-cart="isDisabledAddToCart"
        >
          <UInputNumber
            v-model="qty"
            :class="ui.input({class:'product-cart__add'})"
            :ui="ui?.components?.input"
            :min="0"

          />
        
        </slot>
        <slot
          name="add"
          :product="product"
          :qty="qty"
          :on-add-to-cart="addToCart"
          :on-update-qty="updateQty"
          :disabled-add-to-cart="isDisabledAddToCart"
        >
          <UButton
            type="button"
            variant="solid"
            :disabled="isDisabledAddToCart"
            leading-icon="cart"
            :label="label || t('product.cart.add')"
            :ui="ui?.components?.button"
            @click="addToCart"
            :class="ui.button({class:'product-cart__add'})"
          />
        </slot>
        <slot name="count" :count="line?.qty" :is-disabled-add-to-cart="isDisabledAddToCart">
          <div v-if="line && !isDisabledAddToCart" :class="ui.count({ class:'product-cart__count'})">
            {{ t('cart.line.count', { count: line?.qty || 0 }) }}
            <nuxt-link class="underline" :to="localePath('cart') || 'cart'">
              {{ t('cart.link') }}
            </nuxt-link>
          </div>
        </slot>
      </div>
    </template>
  </ProductCartConfirmation>
</template>
<script lang="ts">
import type { CartLine, Product } from '#models'
import theme, { type ProductCartUI} from '~/theme/ProductCart'
export interface ProductCartProps {
  product: Product
  disableWhenNoStock?: boolean
  disabled?: boolean
  label?: string | null
  class?: string,
  ui?: ProductCartUI
}
export interface ProductCartEmits {
  (e: 'add', qty: number): void
  (e: 'update', qty: number): void
}
</script>
<script lang="ts" setup>
const props = defineProps<ProductCartProps>()
const emit = defineEmits<ProductCartEmits>()

const cartService = useShopinvaderService('cart')
const localePath = useLocalePath()
const { t } = useI18n()
const ui = componentUI('ProductCart', theme, props?.ui)({})
const cartDrawerOpened = ref(false)
const qty = ref(1)

const stockState = computed(() => props.product?.stock?.global?.state || null)
const isDisabledAddToCart = computed(() => {
  if (!props.disableWhenNoStock || !props.product.stock) {
    return false
  }
  if (props.disabled) {
    return true
  }
  return stockState.value === 'out_of_stock'
})

const line = computed(() => {
  const cart = cartService.getCart()
  return cart?.value?.lines?.find((line: CartLine) => line.productId === props.product?.id) || null
})

const addToCart = () => {
  if (isDisabledAddToCart.value) {
    return false
  }
  if (cartService && props.product?.id !== null) {
    emit('add', qty.value)
    cartService.addItem(props.product.id, qty.value)
    cartDrawerOpened.value = true
  }
}

const updateQty = (value: number) => {
  if (isDisabledAddToCart.value) {
    return false
  }
  qty.value = value
}
watch(() => props.product, (newValue) => {
  if (newValue) {
    qty.value = 1
  }
}, { immediate: true })
watch(() => props.disabled, (newValue) => {
  if (newValue) {
    qty.value = 0
  }
}, { immediate: true })
watch(() => qty.value, (value) => {
   if (isDisabledAddToCart.value) {
    return false
  }
  emit('update', value)
}, { immediate: true })
</script>
