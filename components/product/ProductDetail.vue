<template>
  <div v-if="variant !== null" class="product-detail" :class="cssclass">
    <div class="product-detail__header">
      <!-- @slot Breadcrumbs content -->
      <slot name="breadcrumbs" :variant="variant">
        <div class="breadcrumbs text-sm">
          <ul>
            <li>
              <nuxt-link :to="localePath({ path: '/' })">
                {{ $t('navbar.home') }}
              </nuxt-link>
            </li>
            <li v-for="category in breadcrumbs" :key="category.id">
              <nuxt-link :to="localePath({ path: '/' + category.urlKey })">
                {{ category.name }}
              </nuxt-link>
            </li>
            <li>
              {{ variant?.model?.name || variant?.name }}
            </li>
          </ul>
        </div>
      </slot>
    </div>
    <div class="product-detail__tag">
      <slot name="tags" :variant="variant">
        <product-tags v-if="variant" :product="variant" />
      </slot>
    </div>
    <div class="product-detail__image">
      <!-- @slot Image content -->
      <slot name="image" :images="variant.images || []" :variant="variant">
        <product-image-list :images="variant.images || []" :slider="true" />
      </slot>
    </div>
    <div class="product-detail__content">
      <div class="content">
        <div class="content__header">
          <div class="content__ref">
            <!-- @slot Ref content -->
            <slot name="ref" :variant="variant">
              {{ $t('product.ref') }} {{ variant.sku }}
            </slot>
          </div>
          <!-- @slot Header content -->
          <slot name="header" :variant="variant">
            <div class="header">
              <h1 class="header__title">
                {{ variant?.model?.name || variant?.name }}
              </h1>
              <p class="header__subtitle">
                {{ variant.shortName }}
              </p>
            </div>
          </slot>
        </div>

        <div class="content__shortDescription">
          <!-- @slot Intro content -->
          <slot name="intro" :variant="variant">
            <div v-if="variant.shortDescription" v-html="variant.shortDescription"></div>
            <nuxt-link to="#description" class="py-2">
              {{ $t('product.description.link') }}
            </nuxt-link>
          </slot>
        </div>
        <div class="content__variants">
          <!-- @slot Variants content -->
          <slot
            name="variants"
            :variant="variant"
            variants="variants"
            :change-variant="changeVariant"
          >
            <product-variants-selector
              v-if="variant.variantCount > 5 || variants === null"
              :product="variant"
              @select-variant="changeVariant"
            />
            <product-variants
              v-else-if="variants !== null"
              :variants="variants"
              @select-variant="changeVariant"
            >
            </product-variants>
          </slot>
        </div>
        <div class="content__stock">
          <!-- @slot Sxtock content -->
          <slot name="stock" :variant="variant">
            <lazy-product-stock v-if="variant.stock !== null" :stock="variant.stock">
            </lazy-product-stock>
          </slot>
        </div>
        <div class="content__price">
          <!-- @slot Price content -->
          <slot name="price" :variant="variant">
            <client-only>
              <lazy-product-price v-if="price !== null" :price="price" class="py-4 text-right">
                <template #price>
                  <slot name="price" :price="price"></slot>
                </template>
              </lazy-product-price>
            </client-only>
          </slot>
          <!-- @slot Price content -->
          <slot name="add-to-cart" :variant="variant">
            <client-only>
              <product-cart v-if="variant !== null" :product="variant"></product-cart>
            </client-only>
          </slot>
        </div>
      </div>
    </div>
    <div class="product-detail__description" id="description">
      <!-- @slot Description content -->
      <slot name="description" :variant="variant">
        <h2>{{ $t('product.description.title') }}</h2>
        <div v-html="variant.description" class="prose-sm prose max-w-none"></div>
      </slot>
    </div>
    <div class="product-detail__links">
      <!-- @slot Links content -->
      <slot name="links" :variant="variant">
        <product-links v-if="variant" :links="variant.links?.crossLink || []">
          <template #head>
            <h2 class="text-xl">{{ $t('product.cross_selling.title') }}</h2>
          </template>
        </product-links>
        <product-links v-if="variant" :links="variant?.links?.upLink || []">
          <template #head>
            <h2 class="text-xl">{{ $t('product.up_selling.title') }}</h2>
          </template>
        </product-links>
      </slot>
    </div>
    <div class="product-detail__history">
      <!-- @slot History content -->
      <slot name="history" :variant="variant">
        <client-only>
          <lazy-product-history :excluded-id="ids"></lazy-product-history>
        </client-only>
      </slot>
    </div>
  </div>
  <lazy-debug-json-viewer :data="variant"></lazy-debug-json-viewer>
</template>
<script lang="ts" setup>
import type { Product, ProductCategory, ProductPrice } from '#models'
import type { PropType } from 'vue'
import { useHistoryStore } from '~/stores/history'
const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true
  },
  cssclass: {
    type: String,
    default: ''
  }
})
const localePath = useLocalePath()
const variant = ref<any>(props.product)
const router = useRouter()

onMounted(() => {
  if (variant.value?.sku) {
    useHistoryStore()?.addProduct(variant.value)
  }
})

const changeVariant = (product: Product) => {
  const item = {
    ...product,
    variants: props.product.variants
  }
  variant.value = item
  if (item?.sku) {
    const route = useRoute()
    router.push(localePath({ path: route.fullPath, query: { sku: item.sku } }))
  }
}

const breadcrumbs = computed(() => {
  const lastCategoryId: number | null = useHistoryStore()?.lastCategory?.id || null
  const categories = variant.value.categories || []
  let category: ProductCategory | null =
    categories.find((c: any) => c.findCategory(lastCategoryId)) || categories[0] || null
  const items = []
  while (category) {
    items.unshift(category)
    category = category?.childs?.[0] || null
  }
  return items
})

const variants = computed(() => {
  return props.product?.variants || null
})

const ids = computed(() => {
  if (!props.product) return []
  const idList: number[] = []
  if (props.product.id) {
    idList.push(props.product.id)
  }
  if (props.product.variants) {
    props.product.variants.forEach((v) => {
      if (v.id) {
        idList.push(v.id)
      }
    })
  }
  return idList
})

const price = computed((): ProductPrice | null => {
  const authService = useShopinvaderService('auth')
  const user = authService?.getUser()
  const role = (user?.value?.role as string) || null
  let price = variant.value?.pricesList?.['default'] || variant.value?.price || null
  if (role !== null && variant.value?.pricesList?.[role]) {
    price = variant.value?.pricesList?.[role]
  }
  return price
})

/** WATCHER */
watch(
  () => props.product,
  (product) => {
    variant.value = product
  },
  { deep: true }
)
/** SEO
useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      ... breadcrumbs.value.map((category) => ({
        name: category.name,
        item: localePath({ path: '/' + category.urlKey })
      })),
      {
        name: variant.value?.model?.name || variant.value?.name,
        item: localePath({ path: '/' + variant.value?.urlKey })
      }
    ]
  }),
  defineProduct({
    name: variant.value?.name,
    description: variant.value?.shortDescription,
    image: variant.value?.images?.[0]?.url,
    sku: variant.value?.sku
  })
])*/
</script>
<style lang="scss">
.product-detail {
  @apply relative flex flex-wrap p-3 max-md:flex-col md:p-5;
  &__tag {
    @apply absolute left-10 top-16 z-10;
  }
  &__header {
    @apply w-full flex-grow;
  }
  &__image {
    @apply w-full py-4 md:pr-5 md:w-1/2 lg:w-3/5;
    .image-slider {
      @apply bg-white;
    }
  }
  &__content {
    @apply w-full pt-5 md:w-1/2 md:px-2 lg:w-2/5;
    .content {
      @apply sticky top-24;
      &__header {
        @apply mb-4 border-b;
        .header {
          @apply mb-2 w-full;
          &__title {
            @apply mb-0 text-3xl;
          }
          &__subtitle {
            @apply text-lg uppercase text-gray-400;
          }
        }
      }
      &__variants {
        .variants {
          @apply flex flex-wrap;
        }
      }
      &__ref {
        @apply text-sm text-gray-400 pb-4;
      }
      &__shortDescription {
        @apply text-sm prose max-w-none pb-4;
        a {
          @apply text-primary underline;
        }
      }
      &__price {
        @apply border-t mt-4;
      }
    }
    .variants {
      @apply flex flex-wrap;
      &__label {
        @apply w-1/2;
      }
      &__value {
        @apply w-1/2;
      }
    }
  }
  &__description {
    @apply w-full py-4;
  }
  &__history {
    @apply w-full py-4;
  }
}
</style>
