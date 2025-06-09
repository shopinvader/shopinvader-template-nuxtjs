<template>
  <div class="line">
    <div class="line__image">
      <slot v-if="line?.product?.images" name="image" :images="line.product?.images || null">
        <product-image
          v-if="line?.product?.images?.length > 0"
          :image="line?.product.images[0] as ProductImageSet"
          class="product-hit__image"
          @click="linkToProduct()"
        >
        </product-image>
      </slot>
    </div>
    <div class="line__content">
      <div class="content__text">
        <div class="content__header">
          <slot name="header" :line="line"> {{ line.name }}</slot>
        </div>
        <div class="content__content">
          <slot name="content" :line="line">
            <div v-if="line?.product?.urlKey">
              <nuxt-link
                :to="localePath('/' + line.product.urlKey)"
                target="_blank"
                class="underline"
              >
                {{ t('sale.product_link') }}
              </nuxt-link>
            </div>
          </slot>
        </div>
        <div class="content__qty">
          <slot name="qty" :line="line">
            {{ t('sale.quantity', { qty: line.qty }) }}
            <div v-if="line?.qtyDelivered" class="value">
              | {{ t('sale.quantity_delivered', { qty: line?.qtyDelivered }) }}
            </div>
          </slot>
        </div>
      </div>
      <div class="content__price">
        <slot name="price" :line="line">
          <div class="value">
            <div v-if="line.amount.discountTotal !== 0" class="price__original">
              {{ formatCurrency(line.amount.totalWithoutDiscount) }}
            </div>
            <div class="price__value">
              {{ formatCurrency(line.amount.total) }}
            </div>
          </div>
        </slot>
      </div>
      <div class="content__actions">
        <slot name="actions" :line="line"> </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { ProductImageSet, SaleLine } from '#models'
import type { PropType } from 'vue'
import { formatCurrency } from '~/utils/StringHelper'

const props = defineProps({
  line: {
    type: Object as PropType<SaleLine>,
    required: true
  }
})
const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()

const linkToProduct = () => {
  router.push({ path: `/${props.line.product.urlKey}` })
}
</script>
<style>
@reference "@/assets/css/main.css";

.line {
  @apply flex flex-wrap items-start rounded-lg border-2 p-3 md:items-center;
  &__image {
    @apply flex h-16 w-16 items-center justify-center bg-base-100 px-4 lg:mb-0 lg:h-24 lg:w-24;
  }
  &__content {
    @apply flex w-9/12 flex-grow justify-between px-4 lg:w-9/12;
    .content {
      &__text {
        @apply flex flex-grow flex-col;
      }
      &__header {
        @apply font-heading;
      }
      &__title {
        .title {
          @apply flex-grow text-gray-500;
        }
      }
      &__content {
        @apply pb-3;
      }
      &__qty {
        @apply flex gap-2 text-sm text-gray-500;
      }
      &__price {
        @apply flex flex-row p-2;
        .price {
          &__value {
            @apply text-sm font-normal text-gray-900;
          }
          &__tax {
            @apply text-xs font-normal text-gray-500;
          }
          &__original {
            @apply text-sm font-normal text-gray-500 line-through;
          }
        }
      }
      &__actions {
        @apply flex flex-row items-end justify-between p-2 md:items-center;
      }
    }
  }
}
</style>
