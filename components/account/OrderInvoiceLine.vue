<template>
  <div class="line">
    <div class="line__image">
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
    <div class="line__content">
      <div class="content__text">
        <div class="content__header">
          <slot name="header" :line="line"> {{ line.name }}</slot>
        </div>
        <div class="content__title">
          <slot name="title" :line="line"> </slot>
        </div>
        <div class="content__qty">
          <slot name="qty" :line="line"> </slot>
        </div>
      </div>
      <div class="content__price">
        <slot name="price" :line="line"> </slot>
      </div>
      <div class="content__actions">
        <slot name="actions" :line="line">
        </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import { SaleLines } from '#models'

export default defineNuxtComponent({
  name: 'OrderInvoiceLine',
  props: {
    line: {
      type: Object as PropType<SaleLines>,
      required: true
    }
  }
})
</script>
<style lang="scss">
.line {
  @apply -mx-4 mb-4 flex flex-wrap items-center rounded-lg rounded-lg border-2 p-10;
  &__image {
    @apply mb-8 w-full px-4 lg:mb-0 lg:w-3/12;
  }
  &__content {
    @apply flex w-full justify-between px-4 lg:w-9/12;
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
        @apply flex flex-row p-2;
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
      &__actions {
        @apply flex flex-row p-2 items-end justify-between md:items-center;
      }
    }
  }
}
</style>
