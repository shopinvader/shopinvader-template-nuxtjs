<template>
  <UCard
    :ui="{
      root: ui.root({ class: 'product-hit'}),
      header: ui.header({ class: 'product-hit__header' }),
      body: ui.body({ class: 'product-hit__body' }),
      footer: ui.footer({ class: 'product-hit__footer' }),
    }"
  >
    <template #header>
      <slot name="header" :product="variant"></slot>
      <div :class="ui.tag({ class: 'product-hit__tag'})">
        <slot name="tags" :product="variant">
          <product-tags 
            v-if="variant" 
            :product="variant"
            :ui="theme?.components?.productTags"
          />
        </slot>
      </div>
      <div :class="ui.image({ class: 'product-hit__image'})">
        <slot name="images" :product="variant" :images="variant?.images || null">
          <product-image
            v-if="variant?.images && variant.images.length > 0"
            :image="variant.images[0]"
            :ui="theme?.components?.productImage"
            @click="linkToProduct()"
          >
          </product-image>
          <div v-else class="noimage" @click="linkToProduct()"></div>
        </slot>
      </div>
    </template>
    <slot name="body" :product="variant">
      <div :class="ui.title({ class: 'body__title' })">
        <slot name="title" :product="variant">
          <nuxt-link v-if="linkPath" :to="linkPath">
            {{ variant?.model?.name || variant?.name }}
          </nuxt-link>
        </slot>
      </div>
      <div :class="ui.variants({ class: 'body__variants' })">
        <slot name="variants" :variants="variants">
          <div v-if="variant?.variantCount && variant?.variantCount > 1">
            {{ t('product.variants.count', { count: variant?.variantCount }) }}
          </div>
        </slot>
      </div>
      <div :class="ui.desc({ class: 'body__desc' })">
        <div>
          <slot name="desc" :product="variant"></slot>
        </div>
      </div>
      <div :class="ui.stock({ class: 'body__stock' })">
        <slot name="product-stock" :product="variant">
          <product-stock 
            v-if="variant && variant?.stock !== null" 
            :stock="variant?.stock"
            :ui="theme?.components?.productStock"
          />
        </slot>
      </div>
      <div :class="ui.price({ class: 'body__price' })">
        <slot name="price" :product="variant" :price="price">
          <product-price v-if="price !== null" :price="price" :ui="theme?.components?.productPrice"/>
        </slot>
      </div>
      <div v-if="!readonly && !!slots.actions" :class="ui.actions({ class: 'body__actions' })">
        <slot name="actions" :product="variant"> </slot>
      </div>
    </slot>
    <template v-if="!!slots.footer" #footer>
      <slot name="footer" :product="variant"></slot>
    </template>
  </UCard>
</template>
<script lang="ts">
import type { Product, ProductPrice } from '#models'
import theme from '~/theme/ProductHit'
export type ProductHitUi = typeof theme
export interface ProductHitProps {
  product?: Product | null
  inline?: boolean
  readonly?: boolean
  ui?: ProductHitUi
}
export interface ProductHitSlots {
  header?: { product: Product | null }
  body?: { product: Product | null, variants?: Product[] }
  footer?: { product: Product | null }
  images?: { product: Product | null, images: string[] | null }
  title?: { product: Product | null }
  desc?: { product: Product | null }
  price?: { product: Product | null, price: ProductPrice | null }
  actions?: { product: Product | null }
  tags?: { product: Product | null }
}
</script>
<script lang="ts" setup>
const props = defineProps<ProductHitProps>()
const slots = defineSlots<ProductHitSlots>()
const { t } = useI18n()
const ui = computed(() => componentUI('ProductHit', theme, props.ui)({}))

const localePath = useLocalePath()
const authService = useShopinvaderService('auth')
const router = useRouter()

const variant = ref((props.product as Product | null) || null) as Ref<Product | null>
const variants = computed(() => variant.value?.variants || [])
const linkPath = computed(() => {
  const urlKey = props.product?.urlKey || null
  const sku = props.product?.sku || null
  if (urlKey) {
    return localePath({
      path: '/' + urlKey,
      query: { sku }
    })
  }
  return null
})

const price = computed(() => {
  const user = authService?.getUser()
  const role = (user?.value?.role as string) || null
  let price = variant?.value?.pricesList?.['default'] || variant?.value?.price || null
  if (role !== null && variant?.value?.pricesList?.[role]) {
    price = variant?.value?.pricesList?.[role]
  }
  return price
})

watch(
  () => props.product,
  (product: Product, oldProduct: Product) => {
    if (product !== null) {
      variant.value = product
    } else if (oldProduct !== null && product == null) {
      variant.value = null
    }
  }
)

const linkToProduct = () => {
  const path = linkPath.value || null
  if (path) {
    let query = {}
    const { variantCount, sku, main } = variant?.value || {}
    if (!main && variantCount && variantCount > 1) {
      query = { sku }
    }
    router.push({
      path,
      query
    })
  }
}

</script>
