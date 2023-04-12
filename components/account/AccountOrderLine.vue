<template>
  <div class="orderline">
    <div class="orderline__image">
      <slot
        v-if="line.product"
        name="image"
        :images="line.product?.images || null"
      >
        <product-image
          v-if="product && product?.images && product.images.length > 0"
          :image="product.images[0]"
          class="product-hit__image"
          @click="linkToProduct()"
        >
        </product-image>
      </slot>
    </div>
    <div class="orderline__content">
      <div class="content__text">
        <div class="content__header">
          <slot name="header" :line="line"
            >PRODUCT NAME {{ line.product.model }}</slot
          >
        </div>
        <div class="content__title">
          <slot name="title" :line="line">
            <nuxt-link class="title" to="/">
              Product short descriptionTODO
            </nuxt-link>
          </slot>
        </div>
        <div class="content__qty">
          <slot name="qty" :line="line">
            <div class="qty__label">
              {{ $t('cart.line.quantity') }} :
              <span class="font-bold text-gray-900">
                {{ line.qty }}
              </span>
            </div>
          </slot>
        </div>
      </div>
      <div class="content__price">
        <slot name="price" :line="line">
          <div class="value">
            <div
              v-if="line.amount.totalWithoutDiscount"
              class="price__original"
            >
              {{ $filter.currency(line.amount.totalWithoutDiscount) }}
            </div>
            <div class="price__value">
              {{ $filter.currency(line.amount.total) }}
            </div>
          </div>
        </slot>
      </div>
      <div class="content__footer">
        <slot name="footer" :line="line">
          <button class="btn-primary btn-xs btn">
            <icon icon="ph:arrow-right"></icon>
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'
import { SaleLines } from '~~/models/Sale'

export default defineNuxtComponent({
  name: 'AccountOrderDetails',
  props: {
    line: {
      type: Object as PropType<SaleLines>,
      required: true
    }
  }
})
</script>
<style lang="scss">
.orderline {
  @apply -mx-4 mb-4 flex flex-wrap items-center p-10 border-2 rounded-lg rounded-lg;
  &__image {
    @apply mb-8 w-full px-4 lg:mb-0 lg:w-2/6;
  }
  &__content {
    @apply flex w-full justify-between px-4 lg:w-4/6;
    .content {
      &__text {
        @apply flex flex-col;
      }
      &__header {
        @apply text-xl font-bold;
      }
      &__title {
        .title {
          @apply text-gray-500;
        }
      }
      &__qty {
        @apply text-gray-500;
      }
      &__price {
        @apply flex flex-row py-2;
        .price {
          &__value {
            @apply text-2xl font-bold text-success;
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
        @apply flex flex-row md:items-center items-end justify-between;
      }
    }
  }
}
</style>
