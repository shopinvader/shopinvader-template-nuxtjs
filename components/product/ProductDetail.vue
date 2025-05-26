<template>
  <div v-if="variant !== null" class="product-detail" :class="cssclass">
    <slot name="schema-seo" :product="variant">
      <product-seo-schema v-if="variant" :product="variant" />
    </slot>
    <div class="product-detail__header">
      <!-- @slot Breadcrumbs content -->
      <slot name="breadcrumbs" :variant="variant">
        <div class="breadcrumbs text-sm max-lg:hidden">
          <ul>
            <li>
              <nuxt-link :to="localePath({ path: '/' })">
                {{ t('navbar.home') }}
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
        <div class="lg:hidden">
          <nuxt-link
            v-if="lastCategory"
            :to="localePath({ path: '/' + lastCategory.urlKey })"
            class="btn btn-ghost btn-sm lg:hidden"
          >
            <icon name="left" class="mr-2" />
            {{ lastCategory.name }}
          </nuxt-link>
        </div>
      </slot>
      <slot name="intro" :variant="variant"></slot>
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
            <slot name="ref" :variant="variant"> {{ t('product.ref') }} {{ variant.sku }} </slot>
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
          <!-- @slot Short Description content -->
          <slot name="short-description" :variant="variant">
            <div v-if="variant.shortDescription" v-html="variant.shortDescription"></div>
            <nuxt-link to="#description" class="py-2">
              {{ t('product.description.link') }}
            </nuxt-link>
          </slot>
        </div>
        <div class="content__variants" v-if="variants !== null && variants.length > 1">
          <!-- @slot Variants content -->
          <slot
            name="variants"
            :variant="variant"
            :variants="variants"
            :change-variant="changeVariant"
          >
            <product-variants-selector
              v-if="variant.variantCount > 5 || variants === null"
              :product="variant"
              @select-variant="changeVariant"
            />
            <product-variants
              v-else-if="variants !== null && variants.length > 1"
              :variants="variants"
              @select-variant="changeVariant"
            >
            </product-variants>
          </slot>
        </div>
        <div class="content__stock">
          <!-- @slot Stock content -->
          <slot name="stock" :variant="variant">
            <product-stock v-if="variant.stock !== null" :stock="variant.stock"> </product-stock>
          </slot>
        </div>
        <div class="content__price">
          <!-- @slot Price content -->
          <slot name="price" :variant="variant">
            <client-only>
              <product-price v-if="price !== null" :price="price" css-class="py-4 text-right">
                <template #price>
                  <slot name="price" :price="price"></slot>
                </template>
              </product-price>
            </client-only>
          </slot>
        </div>
        <div class="content__cart">
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
        <h2>{{ t('product.description.title') }}</h2>
        <div v-html="variant.description" class="prose-sm prose max-w-none"></div>
      </slot>
    </div>
    <div class="product-detail__links">
      <!-- @slot Links content -->
      <slot name="links" :variant="variant">
        <product-links v-if="variant" :links="variant.links?.crossLink || []">
          <template #head>
            <h2 class="text-xl">{{ t('product.cross_selling.title') }}</h2>
          </template>
        </product-links>
        <product-links v-if="variant" :links="variant?.links?.upLink || []">
          <template #head>
            <h2 class="text-xl">{{ t('product.up_selling.title') }}</h2>
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
  <dev-only>
    <lazy-debug-json-viewer :data="variant"></lazy-debug-json-viewer>
  </dev-only>
</template>
<script lang="ts" setup>
import type { ProductCategory, Product, ProductPrice } from '#models'
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

const { t } = useI18n()
const localePath = useLocalePath()
const variant = ref<Product>(props.product)
const router = useRouter()

onMounted(() => {
  if (variant.value?.sku) {
    useHistoryStore()?.addProduct(variant.value)
  }
})

const changeVariant = (product: Product) => {
  variant.value = product
  if (product?.sku) {
    const route = useRoute()
    router.push(localePath({ path: route.fullPath, query: { sku: product.sku } }))
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

const lastCategory = computed(() => {
  return breadcrumbs.value[breadcrumbs.value.length - 1] || null
})
const variants = computed<Product[]>(() => {
  return (props.product?.variants as Product[]) || null
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

/** SEO*/
try {
  useSchemaOrg([
    defineBreadcrumb({
      itemListElement: [
        ...breadcrumbs.value.map((category) => ({
          name: category.name,
          item: localePath({ path: '/' + category.urlKey })
        })),
        {
          name: variant.value?.model?.name || variant.value?.name,
          item: localePath({ path: '/' + variant.value?.urlKey })
        }
      ]
    })
  ])
} catch {
  // do nothing
}
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
    @apply w-full py-4 md:w-1/2 md:pr-5 lg:w-3/5;
    .image-slider {
      @apply bg-white;
    }
  }
  &__content {
    @apply w-full pt-5 md:w-1/2 md:px-2 lg:w-2/5;
    .content {
      @apply sticky top-24;
      &__header {
        @apply order-3 mb-4 border-b;
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
        @apply pb-4 text-sm text-gray-400;
      }
      &__shortDescription {
        @apply prose max-w-none pb-0 text-sm;
        a {
          @apply text-primary underline;
        }
      }
      &__stock {
        @apply pb-4;
        .stock-status {
          @apply font-bold;
          &__available .stock-text {
            @apply text-success;
          }
        }
      }
      &__price {
        @apply mt-4 min-h-48 border-t sm:min-h-14;
      }
      &__cart {
        @apply sm:min-h-28;
        .product-cart {
          @apply transition-opacity duration-700 ease-in-out;
        }
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
