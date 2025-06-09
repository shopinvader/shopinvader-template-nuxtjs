<template>
  <uCard 
    :ui="{
      root: ui.root({ class: 'cartline' }),
      body: ui.content({ class: 'cartline__content' }),
    }"
  >
    <div :class="ui.image({ class: 'cartline__image' })">
      <slot v-if="product" name="image" :images="product?.images || null">
        <ProductImage
          v-if="product && product?.images && product.images.length > 0"
          :image="product.images[0]"
          class="product-hit__image"
          @click="linkToProduct()"
          :ui="ui?.components?.ProductImage"
        />
      </slot>
    </div>
    <div v-if="!!slots?.header" :class="ui.header({ class: 'content__header' })">
      <slot name="header" :line="line"></slot>
    </div>
    <div :class="ui.title({ class: 'content__title' })">
      <slot name="title" :line="line">
        <template v-if="product">
          <nuxt-link class="title" :to="localePath('/' + product.urlKey)">
            {{ product?.model?.name || product?.name }}
          </nuxt-link>
        </template>
        <template v-else>
          <div class="title">
            {{ line?.name }}
          </div>
        </template>
      </slot>
    </div>
    <div :class="ui.subtitle({ class: 'content__subtitle' })">
      <slot name="subtitle" :line="line">
        <ul class="flex divide-x divide-solid text-xs text-gray-500 shortTitle">
          <li v-for="[key, value] in attributes" :key="key">
            {{ value }}
          </li>
        </ul>
      </slot>
    </div>
    <div :class="ui.stock({ class: 'content__stock' })">
      <slot name="stock" :stock="product?.stock">
        <ProductStock v-if="product?.stock" :stock="product?.stock" :ui="ui.components?.stock"/>
      </slot>
    </div>
    <div :class="ui.quantity({ class: 'content__qty' })">
      <slot name="qty" :line="line" v-if="amount.total >= 0">
        <div class="label">
          {{ t('cart.line.quantity') }}
          <span v-if="readonly === true">{{ line?.qty }}</span>
        </div>
        <div class="value">
          <cart-line-qty v-if="!readonly" :line="line"></cart-line-qty>
        </div>
      </slot>
    </div>
    <div v-if="!!slots?.body" :class="ui.body({ class: 'content__body' })">
      <slot name="body" :line="line"></slot>
    </div>
    <div :class="ui?.delete?.({ class: 'content__delete' })">
      <slot v-if="!readonly" name="delete" :line="line" :delete-line="deleteLine">
        <UButton
          type="button"
          variant="link"
          size="sm"
          leading-icon="remove"
          color="neutral"
          :class="ui?.deleteLink?.({ class: 'delete_link' })"
          :label="t('cart.line.delete')"
          @click="deleteLine"
        />
      </slot>
    </div>

    <div :class="ui.price({ class: 'content__price' })">
      <slot name="price" :line="line">
        <div class="label">
          {{ t('cart.line.total') }}
        </div>
        <div v-if="line.amount.discountTotal !== 0" class="line-through text-gray-400 price__original">
          {{ formatCurrency(amount.totalWithoutDiscount) }}
        </div>
        <div class="price__value">
          {{ formatCurrency(amount.total) }}
        </div>
      </slot>
    </div>
    <div v-if="!!slots?.footer" :class="ui.footer({ class: 'content__footer' })">
      <slot name="footer" :line="line" />
    </div>
  </uCard>
</template>
<script lang="ts">
import { type CartLine, type CartLineAmount } from '#models'
import { formatCurrency } from '~/utils/StringHelper'

import theme, { type CartLineUI } from '~/theme/CartLine'
export interface CartLineProps {
  // The cart line to display
  line: CartLine
  ui?: CartLineUI
  // If the line is readonly (can't be modified)
  readonly?: boolean
}
export interface CartLineEmits {
  /**
   * Called after the line is deleted
   * @param line The current line
   */
  deleteLine: (line: CartLine) => void
}
export interface CartLineSlots {
  /**
   * Slot for the image of the product
   * @binding {ProductImage} images - images of the product cart line
   */
  image?: (props: { images: CartLine['product']['images'] }) => any
  /**
   * Slot for the header content
   * @binding {CartLine} line - cart line
   */
  header?: (props: { line: CartLine }) => any
  /**
   * Slot for the title content
   * @binding {CartLine} line - cart line
   */
  title?: (props: { line: CartLine }) => any
  /**
   * Slot for the subtitle content
   * @binding {CartLine} line - cart line
   */
  subtitle?: (props: { line: CartLine }) => any
  /**
   * Slot for the stock content
   * @binding {CartLine} stock - stock of the product
   */
  stock?: (props: { stock: CartLine['product']['stock'] }) => any
  /**
   * Slot for the quantity selector content
   * @binding {CartLine} line - cart line
   */
  qty?: (props: { line: CartLine }) => any
  /**
   * Slot for the body content
   * @binding {CartLine} line - cart line
   */
  body?: (props: { line: CartLine }) => any
  /**
   * Slot for the delete button content
   * @binding {CartLine} line - cart line
   * @binding {Function} deleteLine - function to delete the line
   */
  delete?: (props: { line: CartLine, deleteLine: () => void }) => any
  /**
   * Slot for the price content
   * @binding {CartLine} line - cart line
   */
  price?: (props: { line: CartLine }) => any
  /**
   * Slot for the footer content
   * @binding {CartLine} line - cart line
   */
  footer?: (props: { line: CartLine }) => any
}
</script>
<script lang="ts" setup>

/**
 * Display a line of the cart
 */
const props = defineProps<CartLineProps>()
const emit = defineEmits<CartLineEmits>()
const slots = defineSlots<CartLineSlots>()
const ui = componentUI('CartLine', theme, props?.ui)({})
const localePath = useLocalePath()
const cartService = useShopinvaderService('cart')
const router = useRouter()
const { t } = useI18n()

const amount = computed(() => {
  return props.line?.amount || new CartLineAmount({})
})
const product = computed(() => {
  return props.line?.product || null
})
const hasPendingTransactions = computed(() => {
  return props.line?.hasPendingTransactions || false
})
const attributes = computed(() => {
  if (!product.value) return []
  return Object.entries(product.value?.variantAttributes) || []
})
/**
 * Redirect to the product page
 */
const linkToProduct = () => {
  if (product.value) {
    router.push({
      path: '/' + product.value?.urlKey
    })
  }
}
const deleteLine = () => {
  
  if (cartService !== null) {
    cartService.deleteItem(props.line)
  }
  if (props?.line) {
    emit('deleteLine', props.line)
  }
}


</script>

<style>
@reference "@/assets/css/main.css";

.cartline--- {
  @apply card  card-side mb-2 flex justify-center p-3 sm:flex-nowrap;
  &--pending {
    .cartline__content {
      .content__price .value {
        @apply animate-pulse blur;
      }
    }
  }
  &__image {
    @apply w-32;
  }
  &__content {
    @apply grid w-full auto-rows-min grid-cols-4 gap-2 px-4;
    .content {
      &__header {
        @apply col-span-4;
      }
      &__delete {
        @apply col-span-4 cursor-pointer text-sm max-sm:order-last md:col-span-3;
      }
      &__title {
        @apply col-span-4 leading-none md:col-span-3;
        .title {
          @apply flex-row text-sm font-bold uppercase md:line-clamp-1;
        }
        .shortTitle {
          @apply flex divide-x divide-solid text-xs text-gray-500;
          li {
            @apply px-2 first:pl-0 last:pr-0;
          }
        }
      }
      &__body {
        @apply col-span-4 max-sm:order-first md:col-span-3;
      }
      &__qty {
        @apply col-span-3 flex flex-col text-sm sm:col-span-2 md:col-span-1 md:row-span-2;
        .cart-line-qty {
          @apply h-10 w-full p-0;
          .input-qty {
            @apply max-w-full;
            .input-group {
              @apply h-full items-center;
              .cartline-qty {
                &__btn {
                  @apply h-full w-8 text-base;
                }
                &__input {
                  @apply h-full text-center text-base font-normal;
                }
              }
            }
          }
        }
      }
      &__price {
        @apply flex flex-col items-center justify-between gap-2 pt-2 text-sm md:flex-row;
        .price {
          &__value {
            @apply pb-0 text-lg font-bold leading-3 text-secondary;
          }
          &__tax {
            @apply text-xs font-normal text-gray-500;
          }
          &__original {
            @apply text-sm font-normal text-gray-500 line-through;
          }
        }
      }
      &__footer {
        @apply flex flex-row justify-between;
      }
    }
  }
}
</style>
