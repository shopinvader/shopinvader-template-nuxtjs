<template>
  <div v-if="variant !== null" class="product-detail" :class="class">
    <div class="product-detail__header">
      <!-- @slot Breadcrumbs content -->
      <slot name="breadcrumbs" :variant="variant">
        <div class="breadcrumbs text-sm">
          <ul>
            <li>
              <nuxt-link :to="localePath({ path: '/'})">
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
      <slot name="image" :images="variant.images || []"  :variant="variant">
        <product-image-list :images="variant.images || []" :slider="true" />
      </slot>
    </div>
    <div class="product-detail__content">
      <div class="content">
        <div class="content__header">
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
        <div class="content__ref">
          <!-- @slot Ref content -->
          <slot name="ref" :variant="variant">
            {{ variant.sku }}
          </slot>
        </div>
        <div class="content__shortDescription">
          <!-- @slot Intro content -->
          <slot name="intro" :variant="variant">
            <div
              v-if="variant.shortDescription"
              v-html="variant.shortDescription"
            ></div>
          </slot>
        </div>
        <div class="content__variants">
          <!-- @slot Variants content -->
          <slot name="variants" :variant="variant" :variants="variants" :change-variant="changeVariant">
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
              <lazy-product-price
                v-if="price !== null"
                :price="price"
                class="py-4 text-right"
              >
                <template #price>
                  <slot name="price" :price="price" ></slot>
                </template>
              </lazy-product-price>
            </client-only>
          </slot>
          <!-- @slot Price content -->
          <slot name="add-to-cart" :variant="variant">
            <client-only>
              <product-cart
                v-if="variant !== null"
                :product="variant"
              ></product-cart>
            </client-only>
          </slot>
        </div>
      </div>
    </div>
    <div class="product-detail__description">
      <!-- @slot Description content -->
      <slot name="description" :variant="variant">
        <div
          v-html="variant.description"
          class="prose prose-sm max-w-none"
        ></div>
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
<script lang="ts">
import type { PropType } from 'vue'
import { Product, ProductCategory, ProductPrice } from '#models'
import { useHistoryStore } from '~/stores/history'

export default {
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    },
    class: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const localePath = useLocalePath()
    let variant = ref(props.product)
    const router = useRouter()

    useHistoryStore().addProduct(props.product)
    const changeVariant = (item: Product) => {
      item = {
        ...item,
        variants: props.product.variants
      }
      variant.value = item
      if(item?.sku) {
        const route = useRoute()
        router.push(localePath({ path: route.fullPath, query: { sku: item.sku }}))
      }
    }
    const breadcrumbs = computed(() => {
      const lastCategoryId:number | null = useHistoryStore()?.lastCategory?.id|| null
      const categories =  variant.value.categories || []
      let category: ProductCategory | null = categories.find((c) => c.findCategory(lastCategoryId))  || categories[0] || null
      let items = []
      while (category) {
        items.unshift(category)
        category = category?.childs?.[0] || null
      }
      return items
    })
    return {
      variant,
      breadcrumbs,
      changeVariant,
      localePath
    }
  },
  watch: {
    product: {
      handler: function (product: Product) {
        this.variant = product
      },
      deep: true
    }
  },
  computed: {
    variants() {
      return this.product?.variants || null
    },
    ids() {
      return [
        this.product?.id,
        ...(this.product?.variants || []).map((v) => v.id)
      ]
    },
    price():ProductPrice | null {
      const authService = useShopinvaderService('auth')
      const user = authService.getUser()
      const role = user?.value?.role as string || null
      let price = this.variant?.pricesList?.['default'] || this.variant?.price || null
      if(role !== null && this.variant?.pricesList?.[role]) {
        price = this.variant?.pricesList?.[role]
      }
      return price
    }
  }
}
</script>
<style lang="scss">
.product-detail {
  @apply flex flex-wrap p-3 max-md:flex-col md:p-5 relative;
  &__tag {
    @apply absolute left-10 top-16 z-10;
  }
  &__header {
    @apply w-full flex-grow;
  }
  &__image {
    @apply w-full px-3 md:w-1/2 lg:w-3/5;
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
